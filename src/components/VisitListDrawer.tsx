import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Home,
  Images,
  Mail,
  MapPin,
  ShoppingCart,
  Trash2,
  User,
  X,
} from "lucide-react";
import {
  API_BASE,
  MAX_VISIT_LIST,
  Property,
  TIME_SLOTS,
  bookingDates,
  cardPhoto,
  dateKey,
  fallBackToOriginal,
  firstBookableDate,
  formatSlot,
  fromDateKey,
  isSlotAvailable,
  money,
} from "./exploreShared";

type VisitorFieldsProps = {
  name: string;
  phone: string;
  email: string;
  moveInDate: string;
  onName: (value: string) => void;
  onPhone: (value: string) => void;
  onEmail: (value: string) => void;
  onMoveInDate: (value: string) => void;
};

// Name, WhatsApp number, email and move-in date for cart checkout
export function VisitorFields({
  name,
  phone,
  email,
  moveInDate,
  onName,
  onPhone,
  onEmail,
  onMoveInDate,
}: VisitorFieldsProps) {
  return (
    <div className="zx-book__fields">
      <div className="zx__field">
        <User className="zx__fieldIcon" />
        <input
          required
          type="text"
          className="zx__input"
          value={name}
          onChange={(e) => onName(e.target.value)}
          placeholder="Full name"
          aria-label="Full name"
          autoComplete="name"
        />
      </div>
      <div className="zx__field">
        <span className="zx-book__prefix">+91</span>
        <input
          required
          inputMode="tel"
          className="zx__input"
          style={{ paddingLeft: "3rem" }}
          value={phone}
          onChange={(e) => onPhone(e.target.value)}
          placeholder="Enter your WhatsApp number"
          aria-label="Enter your WhatsApp number"
          autoComplete="tel-national"
        />
      </div>
      <div className="zx__field">
        <Mail className="zx__fieldIcon" />
        <input
          required
          type="email"
          className="zx__input"
          value={email}
          onChange={(e) => onEmail(e.target.value)}
          placeholder="Email"
          aria-label="Email"
          autoComplete="email"
          maxLength={254}
        />
      </div>
      <label className="zx-book__moveIn font-lora">
        <span>Move-in date</span>
        <div className="zx__field">
          <Home className="zx__fieldIcon" />
          <input
            required
            type="date"
            className="zx__input"
            value={moveInDate}
            min={dateKey(new Date())}
            onChange={(e) => onMoveInDate(e.target.value)}
            aria-label="Move-in date"
          />
        </div>
      </label>
    </div>
  );
}

type Slot = { date: string; time: string };

// The whole cart is one tour: one start time, homes visited in one trip
type BookedTour = Slot & { homes: Property[] };

// Which confirmations the booking API sent; null when nothing new was booked
type Notified = { whatsapp: boolean; email: boolean | null } | null;

function successMessage(notified: Notified, host: string | null) {
  const caller = host ? `${host} from our team` : "Our team";
  if (notified?.whatsapp) {
    return `All set! We've sent your visit details to your WhatsApp${
      notified.email ? " and email" : ""
    }. ${caller} will call or message you before the visit.`;
  }
  return `All set! ${caller} will contact you on WhatsApp to confirm your visits.`;
}

type VisitListDrawerProps = VisitorFieldsProps & {
  open: boolean;
  items: Property[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onBooked: (ids: string[]) => void;
};

export function VisitListDrawer({
  open,
  items,
  onClose,
  onRemove,
  onBooked,
  ...visitor
}: VisitListDrawerProps) {
  const [slot, setSlot] = useState<Slot>(() => ({ date: dateKey(firstBookableDate()), time: "" }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booked, setBooked] = useState<BookedTour | null>(null);
  const [confirmation, setConfirmation] = useState("");

  const dates = useMemo(bookingDates, []);
  const times = TIME_SLOTS.filter((t) => isSlotAvailable(fromDateKey(slot.date), t));
  const isTour = items.length > 1;

  // Lock page scroll and allow Escape to close while open
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setBooked(null);
    setError(null);
    onClose();
  }

  const timed = items.length > 0 && Boolean(slot.time);

  async function bookAll(event: FormEvent) {
    event.preventDefault();
    if (!timed || !visitor.moveInDate || !visitor.email.trim()) return;
    const homes = [...items];
    const when = { ...slot };
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/public/visits/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: visitor.name,
          phone: visitor.phone,
          email: visitor.email.trim(),
          move_in_date: visitor.moveInDate,
          visit_date: when.date,
          visit_time: when.time,
          property_ids: homes.map((home) => home.id),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        const unavailable: string[] = payload.unavailable || [];
        if (unavailable.length) {
          unavailable.forEach(onRemove);
          throw new Error(
            `${unavailable.length === 1 ? "One home is" : `${unavailable.length} homes are`} no longer available and ${
              unavailable.length === 1 ? "was" : "were"
            } removed from your cart. Please review and book again.`
          );
        }
        throw new Error(payload.error || "Could not schedule your visit. Please try again.");
      }
      onBooked(homes.map((home) => home.id));
      setSlot((prev) => ({ ...prev, time: "" }));
      setConfirmation(successMessage(payload.notified ?? null, payload.handled_by || null));
      setBooked({ ...when, homes });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not schedule your visit.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const dayLabel = (key: string) =>
    fromDateKey(key).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

  return (
    <div
      className="zx-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Your cart"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <aside className="zx-drawer__panel">
        <header className="zx-drawer__head">
          <div>
            <h2 className="font-heading">
              {booked ? (booked.homes.length > 1 ? "Tour booked" : "Visit booked") : "Your cart"}
            </h2>
            {!booked && (
              <span className="font-lora">
                {items.length} of {MAX_VISIT_LIST} homes
              </span>
            )}
          </div>
          <button type="button" className="zx-modal__close" onClick={close} aria-label="Close">
            <X />
          </button>
        </header>

        {booked ? (
          <div className="zx-drawer__body">
            <div className="zx-success" style={{ minHeight: 0 }}>
              <div className="zx-success__icon">
                <CheckCircle2 />
              </div>
              <p className="font-lora">{confirmation}</p>
            </div>
            <ul className="zx-vl-results font-lora">
              <li className="zx-vl-result zx-vl-result--scheduled">
                <CalendarDays />
                <div>
                  <strong>
                    {booked.homes.length > 1 ? `Tour of ${booked.homes.length} homes` : booked.homes[0].title}
                  </strong>
                  <span>
                    {booked.homes.length > 1 ? "Starts " : ""}
                    {dayLabel(booked.date)} · {formatSlot(booked.time)}
                  </span>
                </div>
              </li>
              {booked.homes.length > 1 &&
                booked.homes.map((home) => (
                  <li key={home.id} className="zx-vl-result zx-vl-result--scheduled">
                    <CheckCircle2 />
                    <div>
                      <strong>{home.title}</strong>
                      <span>{home.area || "Bengaluru"}</span>
                    </div>
                  </li>
                ))}
            </ul>
            <button type="button" className="zx-btn zx-btn--block" onClick={close}>
              Done
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="zx-drawer__body zx-drawer__empty">
            <div className="zx__emptyIcon">
              <ShoppingCart />
            </div>
            <h3 className="font-heading">Your cart is empty</h3>
            <p className="font-lora">
              Add homes you like to your cart, then visit them all in one tour.
            </p>
            <button type="button" className="zx-btn" onClick={close}>
              Browse homes
            </button>
          </div>
        ) : (
          <form className="zx-drawer__form" onSubmit={bookAll}>
            <div className="zx-drawer__body">
              <ul className="zx-vl-list">
                {items.map((item) => (
                  <li key={item.id} className="zx-vl-item">
                    <div className="zx-vl-item__top">
                      <div className="zx-vl-item__thumb">
                        {item.image ? (
                          <img src={cardPhoto(item) || undefined} alt="" onError={fallBackToOriginal(item)} />
                        ) : (
                          <Images />
                        )}
                      </div>
                      <div className="zx-vl-item__info">
                        <span className="zx-card__location font-lora">
                          <MapPin /> {item.area || "Bengaluru"}
                        </span>
                        <strong className="font-heading">{item.title}</strong>
                        <span className="font-lora">{money(item.rent)} /mo</span>
                      </div>
                      <button
                        type="button"
                        className="zx-vl-item__remove"
                        onClick={() => onRemove(item.id)}
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="zx-book__step">
                <div className="zx-book__label font-lora">
                  <CalendarDays /> {isTour ? "When do you want to start your tour?" : "When do you want to visit?"}
                </div>
                <div className="zx-vl-item__when">
                  <div className="zx__field">
                    <CalendarDays className="zx__fieldIcon" />
                    <select
                      className="zx__select"
                      value={slot.date}
                      onChange={(e) => setSlot({ date: e.target.value, time: "" })}
                      aria-label="Visit date"
                    >
                      {dates.map((d) => {
                        const key = dateKey(d);
                        return (
                          <option key={key} value={key} disabled={!TIME_SLOTS.some((t) => isSlotAvailable(d, t))}>
                            {dayLabel(key)}
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown className="zx__fieldChevron" />
                  </div>
                  <div className="zx__field">
                    <Clock3 className="zx__fieldIcon" />
                    <select
                      required
                      className="zx__select"
                      value={slot.time}
                      onChange={(e) => setSlot((prev) => ({ ...prev, time: e.target.value }))}
                      aria-label={isTour ? "Tour start time" : "Visit time"}
                    >
                      <option value="" disabled>
                        {isTour ? "Start time" : "Pick a time"}
                      </option>
                      {times.map((t) => (
                        <option key={t} value={t}>
                          {formatSlot(t)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="zx__fieldChevron" />
                  </div>
                </div>
                {isTour && (
                  <p className="zx-vl-tour__note font-lora">
                    Our agent will plan the order of the homes and call you before the visit.
                  </p>
                )}
              </div>

              <div className="zx-book__step">
                <div className="zx-book__label font-lora">
                  <User /> Your details
                </div>
                <VisitorFields {...visitor} />
              </div>

              {error && <div className="zx-book__error font-lora">{error}</div>}
            </div>

            <footer className="zx-drawer__foot">
              <button type="submit" disabled={!timed || submitting} className="zx-btn zx-btn--block">
                {submitting
                  ? "Scheduling…"
                  : !timed
                  ? isTour
                    ? "Pick a start time"
                    : "Pick a time"
                  : isTour
                  ? `Book tour of ${items.length} homes`
                  : "Book visit"}
              </button>
            </footer>
          </form>
        )}
      </aside>
    </div>
  );
}
