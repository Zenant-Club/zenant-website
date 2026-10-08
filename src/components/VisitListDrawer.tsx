import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Home,
  Images,
  MapPin,
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
  dateKey,
  firstBookableDate,
  formatSlot,
  fromDateKey,
  isSlotAvailable,
  money,
} from "./exploreShared";

type VisitorFieldsProps = {
  name: string;
  phone: string;
  moveInDate: string;
  onName: (value: string) => void;
  onPhone: (value: string) => void;
  onMoveInDate: (value: string) => void;
};

// Name, WhatsApp number and move-in date — shared by single and multi-home booking
export function VisitorFields({
  name,
  phone,
  moveInDate,
  onName,
  onPhone,
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
          placeholder="WhatsApp number"
          aria-label="WhatsApp number"
          autoComplete="tel-national"
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

type BookingResult = {
  property: Property;
  date: string;
  time: string;
  status: "scheduled" | "already_scheduled" | "failed";
};

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
  const [slots, setSlots] = useState<Record<string, Slot>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BookingResult[] | null>(null);

  const dates = useMemo(bookingDates, []);
  const defaultDate = useMemo(() => dateKey(firstBookableDate()), []);
  const slotFor = (id: string): Slot => slots[id] || { date: defaultDate, time: "" };

  const updateSlot = (id: string, next: Partial<Slot>) =>
    setSlots((prev) => ({ ...prev, [id]: { ...slotFor(id), ...next } }));

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
    setResults(null);
    setError(null);
    onClose();
  }

  const allTimed = items.length > 0 && items.every((item) => slotFor(item.id).time);

  async function bookAll(event: FormEvent) {
    event.preventDefault();
    if (!allTimed || !visitor.moveInDate) return;
    const snapshot = items.map((property) => ({ property, ...slotFor(property.id) }));
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/public/visits/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: visitor.name,
          phone: visitor.phone,
          move_in_date: visitor.moveInDate,
          visits: snapshot.map((v) => ({
            property_id: v.property.id,
            visit_date: v.date,
            visit_time: v.time,
          })),
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
            } removed from your list. Please review and book again.`
          );
        }
        const culprit = snapshot.find((v) => v.property.id === payload.property_id);
        throw new Error(
          (culprit ? `${culprit.property.title}: ` : "") +
            (payload.error || "Could not schedule your visits. Please try again.")
        );
      }
      const statusById = new Map<string, BookingResult["status"]>(
        (payload.results || []).map((r: { property_id: string; status: BookingResult["status"] }) => [
          r.property_id,
          r.status,
        ])
      );
      const outcome = snapshot
        .map((v) => ({ ...v, status: statusById.get(v.property.id) || "failed" }))
        .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
      const booked = outcome.filter((r) => r.status !== "failed").map((r) => r.property.id);
      onBooked(booked);
      setSlots((prev) => {
        const next = { ...prev };
        booked.forEach((id) => delete next[id]);
        return next;
      });
      setResults(outcome);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not schedule your visits.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const failedCount = results?.filter((r) => r.status === "failed").length || 0;

  return (
    <div
      className="zx-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Your visit list"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <aside className="zx-drawer__panel">
        <header className="zx-drawer__head">
          <div>
            <h2 className="font-heading">{results ? "Visits requested" : "Your visit list"}</h2>
            {!results && (
              <span className="font-lora">
                {items.length} of {MAX_VISIT_LIST} homes
              </span>
            )}
          </div>
          <button type="button" className="zx-modal__close" onClick={close} aria-label="Close">
            <X />
          </button>
        </header>

        {results ? (
          <div className="zx-drawer__body">
            <div className="zx-success" style={{ minHeight: 0 }}>
              <div className="zx-success__icon">
                <CheckCircle2 />
              </div>
              <p className="font-lora">
                {failedCount === 0
                  ? "All set! Our property manager will contact you on WhatsApp to confirm your visits."
                  : "Some visits couldn't be booked and are still in your list — please try those again."}
              </p>
            </div>
            <ul className="zx-vl-results font-lora">
              {results.map((r) => (
                <li key={r.property.id} className={`zx-vl-result zx-vl-result--${r.status}`}>
                  {r.status === "failed" ? <AlertCircle /> : <CheckCircle2 />}
                  <div>
                    <strong>{r.property.title}</strong>
                    <span>
                      {fromDateKey(r.date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      · {formatSlot(r.time)}
                      {r.status === "already_scheduled" && " · already booked"}
                      {r.status === "failed" && " · not booked"}
                    </span>
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
              <CalendarCheck />
            </div>
            <h3 className="font-heading">Your visit list is empty</h3>
            <p className="font-lora">
              Add homes you like and book visits to all of them in one go.
            </p>
            <button type="button" className="zx-btn" onClick={close}>
              Browse homes
            </button>
          </div>
        ) : (
          <form className="zx-drawer__form" onSubmit={bookAll}>
            <div className="zx-drawer__body">
              <div className="zx-book__label font-lora">
                <CalendarDays /> Pick a time for each home
              </div>
              <ul className="zx-vl-list">
                {items.map((item) => {
                  const slot = slotFor(item.id);
                  const day = fromDateKey(slot.date);
                  const taken = new Set(
                    items
                      .filter((other) => other.id !== item.id && slotFor(other.id).date === slot.date)
                      .map((other) => slotFor(other.id).time)
                  );
                  const times = TIME_SLOTS.filter((t) => isSlotAvailable(day, t));
                  return (
                    <li key={item.id} className="zx-vl-item">
                      <div className="zx-vl-item__top">
                        <div className="zx-vl-item__thumb">
                          {item.image ? <img src={item.image} alt="" /> : <Images />}
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
                          aria-label={`Remove ${item.title} from visit list`}
                        >
                          <Trash2 />
                        </button>
                      </div>
                      <div className="zx-vl-item__when">
                        <div className="zx__field">
                          <CalendarDays className="zx__fieldIcon" />
                          <select
                            className="zx__select"
                            value={slot.date}
                            onChange={(e) => updateSlot(item.id, { date: e.target.value, time: "" })}
                            aria-label={`Visit date for ${item.title}`}
                          >
                            {dates.map((d) => {
                              const key = dateKey(d);
                              return (
                                <option
                                  key={key}
                                  value={key}
                                  disabled={!TIME_SLOTS.some((t) => isSlotAvailable(d, t))}
                                >
                                  {d.toLocaleDateString("en-IN", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                  })}
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
                            onChange={(e) => updateSlot(item.id, { time: e.target.value })}
                            aria-label={`Visit time for ${item.title}`}
                          >
                            <option value="" disabled>
                              Pick a time
                            </option>
                            {times.map((t) => (
                              <option key={t} value={t} disabled={taken.has(t)}>
                                {formatSlot(t)}
                                {taken.has(t) ? " (another visit)" : ""}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="zx__fieldChevron" />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="zx-book__step">
                <div className="zx-book__label font-lora">
                  <User /> Your details
                </div>
                <VisitorFields {...visitor} />
              </div>

              {error && <div className="zx-book__error font-lora">{error}</div>}
            </div>

            <footer className="zx-drawer__foot">
              <button type="submit" disabled={!allTimed || submitting} className="zx-btn zx-btn--block">
                {submitting
                  ? "Scheduling…"
                  : allTimed
                  ? `Book ${items.length} ${items.length === 1 ? "visit" : "visits"}`
                  : "Pick a time for every home"}
              </button>
            </footer>
          </form>
        )}
      </aside>
    </div>
  );
}
