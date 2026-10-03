import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpDown,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Home,
  Images,
  Lock,
  MapPin,
  RotateCcw,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react";

export type Property = {
  id: string;
  title: string;
  area: string;
  type: string;
  rent: number;
  deposit: number;
  furnishing: string;
  image: string | null;
  imageCount: number;
};

export type PropertyDetail = Property & {
  images: string[];
  description: string;
};

type SortOption = "featured" | "price_asc" | "price_desc";

const API_BASE = (
  ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
    ?.VITE_PUBLIC_API_BASE) || ""
).replace(/\/$/, "");

const TIME_SLOTS = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
];

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const dateKey = (d: Date) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);

const formatSlot = (value: string) => {
  const [hour, minute] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(2026, 0, 1, hour, minute));
};

const isSlotAvailable = (targetDate: Date, value: string) => {
  const [hour, minute] = value.split(":").map(Number);
  const slot = new Date(targetDate);
  slot.setHours(hour, minute, 0, 0);
  return slot.getTime() > Date.now() + 60 * 60 * 1000;
};

// Today if it still has a bookable slot, otherwise tomorrow
const firstBookableDate = () => {
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  if (!TIME_SLOTS.some((slot) => isSlotAvailable(day, slot))) day.setDate(day.getDate() + 1);
  return day;
};

export function ExplorePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [selected, setSelected] = useState<PropertyDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  // Booking Form State
  const [date, setDate] = useState(firstBookableDate);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dates = useMemo(() => {
    return Array.from({ length: 14 }, (_, index) => {
      const next = new Date();
      next.setHours(0, 0, 0, 0);
      next.setDate(next.getDate() + index);
      return next;
    });
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/public/properties?limit=36`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((payload) => setProperties(payload.data || []))
      .catch(() => {
        setProperties([]);
        setLoadFailed(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const dialogOpen = Boolean(selected || loadingDetail);

  // Lock page scroll and allow Escape to close while the dialog is open
  useEffect(() => {
    if (!dialogOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDialog();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [dialogOpen]);

  // Compute unique areas and types for filter dropdowns
  const availableAreas = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => {
      if (p.area) set.add(p.area);
    });
    return ["All", ...Array.from(set).sort()];
  }, [properties]);

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => {
      if (p.type) set.add(p.type);
    });
    return ["All", ...Array.from(set).sort()];
  }, [properties]);

  // Filtered & Sorted properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        if (selectedArea !== "All" && p.area !== selectedArea) return false;
        if (selectedType !== "All" && p.type !== selectedType) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchArea = p.area.toLowerCase().includes(q);
          const matchType = p.type.toLowerCase().includes(q);
          if (!matchTitle && !matchArea && !matchType) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.rent - b.rent;
        if (sortBy === "price_desc") return b.rent - a.rent;
        return 0;
      });
  }, [properties, selectedArea, selectedType, searchQuery, sortBy]);

  async function openProperty(property: Property) {
    setLoadingDetail(true);
    setError(null);
    setResult(null);
    setImageIndex(0);
    setDate(firstBookableDate());
    setTime("");
    try {
      const response = await fetch(
        `${API_BASE}/api/public/properties/${encodeURIComponent(property.id)}`
      );
      if (!response.ok) throw new Error("This property is no longer available.");
      const data = await response.json();
      setSelected(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open this property.");
    } finally {
      setLoadingDetail(false);
    }
  }

  function closeDialog() {
    setSelected(null);
    setLoadingDetail(false);
    setResult(null);
    setError(null);
  }

  async function bookVisit(event: FormEvent) {
    event.preventDefault();
    if (!selected || !time) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/public/visits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_id: selected.id,
          name,
          phone,
          visit_date: dateKey(date),
          visit_time: time,
        }),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Could not schedule your visit. Please try again.");
      setResult(
        payload.status === "already_scheduled"
          ? "This visit is already scheduled. Our team will contact you shortly."
          : "Your visit is confirmed! Our property manager will meet you at the scheduled time."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not schedule your visit.");
    } finally {
      setSubmitting(false);
    }
  }

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedArea("All");
    setSelectedType("All");
    setSortBy("featured");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedArea !== "All" ||
    selectedType !== "All" ||
    sortBy !== "featured";

  const availableSlots = TIME_SLOTS.filter((slot) => isSlotAvailable(date, slot));

  return (
    <div className="zx">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="zx__hero">
        <div className="zx__container">
          <span className="zx__eyebrow font-lora">
            <Sparkles /> Curated homes in Bangalore
          </span>
          <h1 className="zx__title font-heading-78">
            Find your <em>next home</em>
          </h1>
          <p className="zx__lede font-lora">
            Verified, ready-to-move apartments managed by Zenant. Browse photos, compare rents,
            and book a free visit in under a minute.
          </p>

          {/* ── Search & Filter Bar ─────────────────────────────────── */}
          <div className="zx__filters">
            <div className="zx__field zx__field--search">
              <Search className="zx__fieldIcon" />
              <input
                type="text"
                className="zx__input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by locality or home name"
                aria-label="Search properties"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="zx__clear"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X />
                </button>
              )}
            </div>

            <div className="zx__field">
              <MapPin className="zx__fieldIcon" />
              <select
                className="zx__select"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                aria-label="Locality"
              >
                {availableAreas.map((a) => (
                  <option key={a} value={a}>
                    {a === "All" ? "All localities" : a}
                  </option>
                ))}
              </select>
              <ChevronDown className="zx__fieldChevron" />
            </div>

            <div className="zx__field">
              <BedDouble className="zx__fieldIcon" />
              <select
                className="zx__select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                aria-label="Home type"
              >
                {availableTypes.map((t) => (
                  <option key={t} value={t}>
                    {t === "All" ? "Any home type" : t}
                  </option>
                ))}
              </select>
              <ChevronDown className="zx__fieldChevron" />
            </div>

            <div className="zx__field">
              <ArrowUpDown className="zx__fieldIcon" />
              <select
                className="zx__select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort by"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Rent: low to high</option>
                <option value="price_desc">Rent: high to low</option>
              </select>
              <ChevronDown className="zx__fieldChevron" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Results ──────────────────────────────────────────────────── */}
      <section className="zx__container">
        {!loading && !loadFailed && (
          <div className="zx__resultsBar font-lora">
            <span>
              <strong>{filteredProperties.length}</strong>{" "}
              {filteredProperties.length === 1 ? "home" : "homes"}
              {hasActiveFilters ? " match your filters" : " available"}
            </span>
            {hasActiveFilters && (
              <button type="button" className="zx__linkBtn" onClick={resetFilters}>
                <RotateCcw /> Reset filters
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="zx__grid" style={{ marginTop: "1.75rem" }} aria-busy="true">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="zx-card zx-skeleton">
                <div className="zx-card__media" />
                <div className="zx-card__body">
                  <div className="zx-skeleton__line" style={{ width: "40%" }} />
                  <div className="zx-skeleton__line" style={{ width: "75%", height: 18 }} />
                  <div className="zx-skeleton__line" style={{ width: "50%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : loadFailed || filteredProperties.length === 0 ? (
          <div className="zx__empty" style={loadFailed ? { marginTop: "1.75rem" } : undefined}>
            <div className="zx__emptyIcon">
              <Home />
            </div>
            <h3 className="font-heading">
              {loadFailed ? "Couldn't load homes right now" : "No homes match these filters"}
            </h3>
            <p className="font-lora">
              {loadFailed
                ? "Please refresh the page in a moment, or message us on WhatsApp and we'll share options directly."
                : "Try a different locality or home type, or clear your filters to see everything."}
            </p>
            {loadFailed ? (
              <button type="button" className="zx-btn" onClick={() => window.location.reload()}>
                <RotateCcw size={16} /> Try again
              </button>
            ) : (
              <button type="button" className="zx-btn" onClick={resetFilters}>
                Show all homes
              </button>
            )}
          </div>
        ) : (
          <div className="zx__grid">
            {filteredProperties.map((property) => (
              <button
                key={property.id}
                type="button"
                className="zx-card"
                onClick={() => openProperty(property)}
                aria-label={`View ${property.title} and book a visit`}
              >
                <div className="zx-card__media">
                  {property.image ? (
                    <img src={property.image} alt="" loading="lazy" />
                  ) : (
                    <div className="zx-card__noPhoto font-lora">
                      <Images />
                      Photos coming soon
                    </div>
                  )}
                  {property.type && (
                    <span className="zx-badge zx-badge--type">{property.type}</span>
                  )}
                  {property.imageCount > 1 && (
                    <span className="zx-badge zx-badge--photos">
                      <Images /> {property.imageCount}
                    </span>
                  )}
                </div>

                <div className="zx-card__body">
                  <span className="zx-card__location font-lora">
                    <MapPin /> {property.area || "Bangalore"}
                  </span>
                  <h3 className="zx-card__title font-heading">{property.title}</h3>

                  {property.furnishing && (
                    <div className="zx-card__tags">
                      <span className="zx-tag">{property.furnishing}</span>
                    </div>
                  )}

                  <div className="zx-card__footer">
                    <div>
                      <div className="zx-card__price font-heading">
                        {money(property.rent)}
                        <small> /mo</small>
                      </div>
                      {property.deposit > 0 && (
                        <div className="zx-card__deposit font-lora">
                          {money(property.deposit)} deposit
                        </div>
                      )}
                    </div>
                    <span className="zx-card__cta">
                      Book visit <ArrowRight />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── Property Detail & Visit Scheduler Modal ──────────────────── */}
      {dialogOpen && (
        <div
          className="zx-modal"
          role="dialog"
          aria-modal="true"
          aria-label={selected?.title || "Loading property"}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDialog();
          }}
        >
          <div className="zx-modal__panel">
            <button type="button" className="zx-modal__close" onClick={closeDialog} aria-label="Close">
              <X />
            </button>

            {!selected ? (
              <div className="zx-modal__loading font-lora">
                <div className="zx-spinner" />
                Loading home details…
              </div>
            ) : (
              <div className="zx-modal__scroll">
                <div className="zx-modal__grid">
                  {/* Left: gallery & details */}
                  <div className="zx-modal__info">
                    <div className="zx-gallery__main">
                      {selected.images[imageIndex] ? (
                        <img
                          src={selected.images[imageIndex]}
                          alt={`${selected.title}, photo ${imageIndex + 1} of ${selected.images.length}`}
                        />
                      ) : (
                        <div className="zx-card__noPhoto font-lora">
                          <Images />
                          Photos coming soon
                        </div>
                      )}

                      {selected.images.length > 1 && (
                        <>
                          <button
                            type="button"
                            className="zx-gallery__nav zx-gallery__nav--prev"
                            onClick={() =>
                              setImageIndex((prev) =>
                                prev === 0 ? selected.images.length - 1 : prev - 1
                              )
                            }
                            aria-label="Previous photo"
                          >
                            <ChevronLeft />
                          </button>
                          <button
                            type="button"
                            className="zx-gallery__nav zx-gallery__nav--next"
                            onClick={() =>
                              setImageIndex((prev) =>
                                prev === selected.images.length - 1 ? 0 : prev + 1
                              )
                            }
                            aria-label="Next photo"
                          >
                            <ChevronRight />
                          </button>
                          <span className="zx-badge zx-badge--photos">
                            {imageIndex + 1} / {selected.images.length}
                          </span>
                        </>
                      )}
                    </div>

                    {selected.images.length > 1 && (
                      <div className="zx-gallery__thumbs">
                        {selected.images.map((img, idx) => (
                          <button
                            key={img}
                            type="button"
                            onClick={() => setImageIndex(idx)}
                            className={`zx-gallery__thumb${
                              idx === imageIndex ? " zx-gallery__thumb--active" : ""
                            }`}
                            aria-label={`Show photo ${idx + 1}`}
                          >
                            <img src={img} alt="" />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="zx-detail__location font-lora">
                      <MapPin /> {selected.area || "Bangalore"}
                    </div>
                    <h2 className="zx-detail__title font-heading">{selected.title}</h2>

                    <div className="zx-detail__facts">
                      <div className="zx-detail__fact">
                        <span className="font-lora">Monthly rent</span>
                        <strong>{money(selected.rent)}</strong>
                      </div>
                      <div className="zx-detail__fact">
                        <span className="font-lora">Security deposit</span>
                        <strong>{selected.deposit > 0 ? money(selected.deposit) : "—"}</strong>
                      </div>
                      <div className="zx-detail__fact">
                        <span className="font-lora">Home type</span>
                        <strong>{selected.type || "—"}</strong>
                      </div>
                      <div className="zx-detail__fact">
                        <span className="font-lora">Furnishing</span>
                        <strong>{selected.furnishing || "—"}</strong>
                      </div>
                    </div>

                    {selected.description && (
                      <div className="zx-detail__about">
                        <h4 className="font-lora">About this home</h4>
                        <p className="font-lora">{selected.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Right: visit booking */}
                  <div className="zx-modal__book">
                    {result ? (
                      <div className="zx-success">
                        <div className="zx-success__icon">
                          <CheckCircle2 />
                        </div>
                        <h3 className="font-heading">Visit requested</h3>
                        <p className="font-lora">{result}</p>

                        <div className="zx-success__summary font-lora">
                          <strong>{selected.title}</strong>
                          <div>
                            <CalendarDays />
                            {date.toLocaleDateString("en-IN", { dateStyle: "full" })}
                          </div>
                          <div>
                            <Clock3 />
                            {time ? formatSlot(time) : "Flexible"}
                          </div>
                        </div>

                        <button type="button" className="zx-btn zx-btn--block" onClick={closeDialog}>
                          Done
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={bookVisit}>
                        <h3 className="zx-book__title font-heading">Book a free visit</h3>
                        <p className="zx-book__sub font-lora">
                          Our community manager will show you around. No brokerage, no obligation.
                        </p>

                        <div className="zx-book__step">
                          <div className="zx-book__label font-lora">
                            <CalendarDays /> Pick a date
                          </div>
                          <div className="zx-book__dates">
                            {dates.map((item) => {
                              const active = dateKey(item) === dateKey(date);
                              return (
                                <button
                                  type="button"
                                  key={dateKey(item)}
                                  onClick={() => {
                                    setDate(item);
                                    setTime("");
                                  }}
                                  className={`zx-chip zx-date${active ? " zx-chip--active" : ""}`}
                                  aria-pressed={active}
                                >
                                  <span>
                                    {item.toLocaleDateString("en-IN", { weekday: "short" })}
                                  </span>
                                  <strong>{item.getDate()}</strong>
                                  <span>
                                    {item.toLocaleDateString("en-IN", { month: "short" })}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="zx-book__step">
                          <div className="zx-book__label font-lora">
                            <Clock3 /> Pick a time
                          </div>
                          {availableSlots.length > 0 ? (
                            <div className="zx-book__times">
                              {availableSlots.map((slot) => {
                                const active = time === slot;
                                return (
                                  <button
                                    type="button"
                                    key={slot}
                                    onClick={() => setTime(slot)}
                                    className={`zx-chip zx-time${active ? " zx-chip--active" : ""}`}
                                    aria-pressed={active}
                                  >
                                    {formatSlot(slot)}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="zx-book__none font-lora">
                              No slots left today — pick another date.
                            </p>
                          )}
                        </div>

                        <div className="zx-book__step">
                          <div className="zx-book__label font-lora">
                            <User /> Your details
                          </div>
                          <div className="zx-book__fields">
                            <div className="zx__field">
                              <User className="zx__fieldIcon" />
                              <input
                                required
                                type="text"
                                className="zx__input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="WhatsApp number"
                                aria-label="WhatsApp number"
                                autoComplete="tel-national"
                              />
                            </div>
                          </div>
                        </div>

                        {error && <div className="zx-book__error font-lora">{error}</div>}

                        <button
                          type="submit"
                          disabled={!time || submitting}
                          className="zx-btn zx-btn--block zx-book__submit"
                        >
                          {submitting
                            ? "Scheduling…"
                            : time
                            ? `Confirm visit · ${formatSlot(time)}`
                            : "Select a time to continue"}
                        </button>

                        <p className="zx-book__note font-lora">
                          <Lock /> We'll only use your number to confirm this visit.
                        </p>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
