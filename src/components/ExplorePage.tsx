import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpDown,
  BedDouble,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Home,
  Images,
  IndianRupee,
  ListChecks,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  User,
  X,
} from "lucide-react";
import {
  API_BASE,
  MAX_VISIT_LIST,
  Property,
  PropertyDetail,
  TIME_SLOTS,
  bookingDates,
  dateKey,
  firstBookableDate,
  formatSlot,
  isSlotAvailable,
  money,
} from "./exploreShared";
import { VisitListDrawer, VisitorFields } from "./VisitListDrawer";

type SortOption = "featured" | "price_asc" | "price_desc";

const VISIT_LIST_KEY = "zenant.visitList";

// The visit list survives reloads; a corrupt or missing entry just starts empty
const loadVisitList = (): Property[] => {
  try {
    const stored = JSON.parse(localStorage.getItem(VISIT_LIST_KEY) || "[]");
    return Array.isArray(stored) ? stored.slice(0, MAX_VISIT_LIST) : [];
  } catch {
    return [];
  }
};

type BudgetOption = { id: string; label: string; min: number; max: number };

const BUDGETS: BudgetOption[] = [
  { id: "any", label: "Any budget", min: 0, max: Infinity },
  { id: "u20", label: "Under ₹20,000", min: 0, max: 20_000 },
  { id: "20-25", label: "₹20,000 – ₹25,000", min: 20_000, max: 25_000 },
  { id: "25-30", label: "₹25,000 – ₹30,000", min: 25_000, max: 30_000 },
  { id: "30-35", label: "₹30,000 – ₹35,000", min: 30_000, max: 35_000 },
  { id: "35+", label: "₹35,000 and above", min: 35_000, max: Infinity },
];

// Amenities offered as filters, in display order; only those present on a listed home are shown
const AMENITY_LABELS: Record<string, string> = {
  wifi: "Wi-Fi",
  parking: "Parking",
  lift: "Lift",
  power_backup: "Power backup",
  security: "Security",
  cctv: "CCTV",
  ac: "AC",
  geyser: "Geyser",
  washing_machine: "Washing machine",
  refrigerator: "Refrigerator",
  tv: "TV",
  balcony: "Balcony",
  wardrobe: "Wardrobe",
  modular_kitchen: "Modular kitchen",
  housekeeping: "Housekeeping",
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
  const [budgetId, setBudgetId] = useState("any");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const amenitiesRef = useRef<HTMLDivElement>(null);

  // Booking Form State
  const [date, setDate] = useState(firstBookableDate);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Visit list: homes saved to book together, like a shopping cart
  const [visitList, setVisitList] = useState<Property[]>(loadVisitList);
  const [visitListOpen, setVisitListOpen] = useState(false);
  const [listNotice, setListNotice] = useState<string | null>(null);

  const dates = useMemo(bookingDates, []);

  useEffect(() => {
    try {
      localStorage.setItem(VISIT_LIST_KEY, JSON.stringify(visitList));
    } catch {
      // Private browsing or full storage: the list still works for this visit
    }
  }, [visitList]);

  useEffect(() => {
    if (!listNotice) return;
    const timer = window.setTimeout(() => setListNotice(null), 3500);
    return () => window.clearTimeout(timer);
  }, [listNotice]);

  useEffect(() => {
    fetch(`${API_BASE}/api/public/properties?limit=36`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((payload) => {
        const fresh: Property[] = payload.data || [];
        setProperties(fresh);
        // Refresh saved homes with current rent/photos and drop any no longer listed
        const byId = new Map(fresh.map((p) => [p.id, p]));
        setVisitList((prev) => prev.flatMap((p) => byId.get(p.id) || []));
      })
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

  // Close the amenities menu on outside click or Escape
  useEffect(() => {
    if (!amenitiesOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!amenitiesRef.current?.contains(e.target as Node)) setAmenitiesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAmenitiesOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [amenitiesOpen]);

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

  const availableAmenities = useMemo(() => {
    const present = new Set(properties.flatMap((p) => p.amenities || []));
    return Object.keys(AMENITY_LABELS).filter((key) => present.has(key));
  }, [properties]);

  const toggleAmenity = (key: string) =>
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );

  const budget = BUDGETS.find((b) => b.id === budgetId) || BUDGETS[0];

  // Filtered & Sorted properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        if (selectedArea !== "All" && p.area !== selectedArea) return false;
        if (selectedType !== "All" && p.type !== selectedType) return false;
        if (p.rent < budget.min || p.rent >= budget.max) return false;
        if (selectedAmenities.some((a) => !(p.amenities || []).includes(a))) return false;
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
  }, [properties, selectedArea, selectedType, budget, selectedAmenities, searchQuery, sortBy]);

  const inVisitList = (id: string) => visitList.some((p) => p.id === id);

  function toggleVisitList(property: Property) {
    if (inVisitList(property.id)) {
      setVisitList((prev) => prev.filter((p) => p.id !== property.id));
      return;
    }
    if (visitList.length >= MAX_VISIT_LIST) {
      setListNotice(`Your visit list is full — book these ${MAX_VISIT_LIST} homes first.`);
      return;
    }
    // Drop detail-only fields so the stored list stays small
    const { id, title, area, type, rent, deposit, furnishing, image, imageCount, amenities } = property;
    setVisitList((prev) => [
      ...prev,
      { id, title, area, type, rent, deposit, furnishing, image, imageCount, amenities },
    ]);
    setListNotice("Added to your visit list");
  }

  const removeFromVisitList = (id: string) =>
    setVisitList((prev) => prev.filter((p) => p.id !== id));

  function openVisitList() {
    closeDialog();
    setVisitListOpen(true);
  }

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
    if (!selected || !time || !moveInDate) return;
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
          move_in_date: moveInDate,
        }),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Could not schedule your visit. Please try again.");
      removeFromVisitList(selected.id);
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
    setBudgetId("any");
    setSelectedAmenities([]);
    setSortBy("featured");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedArea !== "All" ||
    selectedType !== "All" ||
    budgetId !== "any" ||
    selectedAmenities.length > 0 ||
    sortBy !== "featured";

  const availableSlots = TIME_SLOTS.filter((slot) => isSlotAvailable(date, slot));

  // Shared by the single-visit form and the visit list, so details are typed once
  const visitorFields = {
    name,
    phone,
    moveInDate,
    onName: setName,
    onPhone: setPhone,
    onMoveInDate: setMoveInDate,
  };

  return (
    <div className="zx">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="zx__hero">
        <div className="zx__container">
          <span className="zx__eyebrow font-lora">
            <Sparkles /> Rental homes in Bengaluru
          </span>
          <h1 className="zx__title font-heading-78">
            Find your <em>next home</em>
          </h1>
          <p className="zx__lede font-lora">
            Browse verified rental homes, compare rents, and schedule a visit.
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
              <IndianRupee className="zx__fieldIcon" />
              <select
                className="zx__select"
                value={budgetId}
                onChange={(e) => setBudgetId(e.target.value)}
                aria-label="Monthly budget"
              >
                {BUDGETS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="zx__fieldChevron" />
            </div>

            <div className="zx__field zx-amenities" ref={amenitiesRef}>
              <SlidersHorizontal className="zx__fieldIcon" />
              <button
                type="button"
                className="zx__select zx-amenities__toggle"
                onClick={() => setAmenitiesOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={amenitiesOpen}
                disabled={availableAmenities.length === 0}
              >
                {selectedAmenities.length === 0
                  ? "Amenities"
                  : selectedAmenities.length === 1
                  ? AMENITY_LABELS[selectedAmenities[0]]
                  : `${selectedAmenities.length} amenities`}
              </button>
              <ChevronDown className="zx__fieldChevron" />
              {amenitiesOpen && (
                <div className="zx-amenities__menu" role="group" aria-label="Amenities">
                  {availableAmenities.map((key) => (
                    <label key={key} className="zx-amenities__option font-lora">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(key)}
                        onChange={() => toggleAmenity(key)}
                      />
                      {AMENITY_LABELS[key]}
                    </label>
                  ))}
                  {selectedAmenities.length > 0 && (
                    <button
                      type="button"
                      className="zx__linkBtn zx-amenities__clear"
                      onClick={() => setSelectedAmenities([])}
                    >
                      Clear amenities
                    </button>
                  )}
                </div>
              )}
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
            <div className="zx__resultsActions">
              {hasActiveFilters && (
                <button type="button" className="zx__linkBtn" onClick={resetFilters}>
                  <RotateCcw /> Reset filters
                </button>
              )}
              <button type="button" className="zx-vl-open" onClick={openVisitList}>
                <ListChecks /> Visit list
                {visitList.length > 0 && <span className="zx-vl-count">{visitList.length}</span>}
              </button>
            </div>
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
                ? "Please refresh the page in a moment, or message us on WhatsApp."
                : "Try a different locality, budget or amenity, or clear your filters to see everything."}
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
            {filteredProperties.map((property) => {
              const saved = inVisitList(property.id);
              return (
              <div key={property.id} className="zx-cardWrap">
              <button
                type="button"
                className={`zx-card__save${saved ? " zx-card__save--on" : ""}`}
                onClick={() => toggleVisitList(property)}
                aria-pressed={saved}
                aria-label={
                  saved
                    ? `Remove ${property.title} from visit list`
                    : `Add ${property.title} to visit list`
                }
              >
                {saved ? <Check /> : <Plus />}
                {saved ? "In visit list" : "Visit list"}
              </button>
              <button
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
                    <MapPin /> {property.area || "Bengaluru"}
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
              </div>
              );
            })}
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
                      <MapPin /> {selected.area || "Bengaluru"}
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
                        {visitList.length > 0 && (
                          <button
                            type="button"
                            className="zx-btn zx-btn--ghost zx-btn--block"
                            style={{ marginTop: "0.6rem" }}
                            onClick={openVisitList}
                          >
                            <ListChecks size={16} /> Book the {visitList.length} in your visit list
                          </button>
                        )}
                      </div>
                    ) : (
                      <form onSubmit={bookVisit}>
                        <h3 className="zx-book__title font-heading">Schedule a visit</h3>
                        <p className="zx-book__sub font-lora">
                          Pick a date and time that works for you, and our team will be in touch.
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
                          <VisitorFields {...visitorFields} />
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

                        <div className="zx-book__or font-lora">
                          <span>Seeing more than one home?</span>
                        </div>
                        {inVisitList(selected.id) ? (
                          <button
                            type="button"
                            className="zx-btn zx-btn--ghost zx-btn--block"
                            onClick={openVisitList}
                          >
                            <Check size={16} /> In your visit list · Review &amp; book
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="zx-btn zx-btn--ghost zx-btn--block"
                            onClick={() => toggleVisitList(selected)}
                          >
                            <Plus size={16} /> Add to visit list
                          </button>
                        )}
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Visit list: sticky summary bar and drawer ─────────────────── */}
      {(visitList.length > 0 || listNotice) && !visitListOpen && !dialogOpen && (
        <div className="zx-vl-bar" role="status">
          <span className="font-lora">
            {listNotice || (
              <>
                <strong>{visitList.length}</strong>{" "}
                {visitList.length === 1 ? "home" : "homes"} in your visit list
              </>
            )}
          </span>
          {visitList.length > 0 && (
            <button type="button" className="zx-btn" onClick={openVisitList}>
              Review &amp; book <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}

      <VisitListDrawer
        open={visitListOpen}
        items={visitList}
        onClose={() => setVisitListOpen(false)}
        onRemove={removeFromVisitList}
        onBooked={(ids) => setVisitList((prev) => prev.filter((p) => !ids.includes(p.id)))}
        {...visitorFields}
      />
    </div>
  );
}
