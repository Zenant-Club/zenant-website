# Cart Booking as One Tour — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A website cart books one tour: one date and start time, one visits-sheet row listing every home.

**Architecture:** The cart sends one `visit_date`/`visit_time` and a list of `property_ids`. The batch endpoint in `zenant-brainback` writes a single sheet row (homes joined with `", "`, as the WhatsApp bot already does) and one `sheet_visits` mirror row. Notifications still receive one `BookedVisit` per home; when they all share a start time, the text reads as a tour.

**Tech Stack:** React + Vite (website), Flask + gspread + Supabase + pytest (`zenant-brainback`).

**Spec:** `docs/superpowers/specs/2026-11-27-single-tour-booking-design.md`

## Global Constraints

- Cart limit: 5 homes (`MAX_VISIT_LIST = 5`, `MAX_VISITS_PER_BOOKING = 5`); the old request body keeps 10.
- Property cell: home names in cart order, joined with `", "`.
- Sheet row: `[timestamp, name, mobile10, "Website", names, handler, MM/DD/YYYY, "HH:MM AM", "Scheduled"]`.
- Customer WhatsApp template text is fixed by Meta; only the `{schedule}` variable changes and must stay on one line, ≤ `MAX_SCHEDULE_CHARS` (700).
- Booking caps keep their numbers (10 homes/phone/day, 60 homes/hour site-wide) but count homes, not rows.
- Commit straight to `main` in each repo (fetch first); no `Co-Authored-By` trailer.

## Review Focus

- **Old cart still open in a browser during rollout** sends `visits[]` with different times: must book one tour at the earliest time, and the response must still carry `results[]` with a status per `property_id`, or the old cart shows every home as failed. Test in Task 2.
- **Same booking sent twice** (double tap): second call returns `already_scheduled`, no second notification. Test in Task 2.
- **A home unpublished while in the cart:** 409 with `unavailable`, nothing written. Test in Task 2.
- **One home in the cart:** reads as a normal visit everywhere ("Book visit", no "Tour of 1 homes"). Tests in Tasks 1 and 3.
- **Saved cart with more than 5 homes** from before the change: keeps the first 5, booking works. Covered by existing slice in `ExplorePage.tsx:60`; check in Task 3.

---

### Task 1: Tour wording in notifications (`zenant-brainback`)

**Files:**
- Modify: `services/visit_notifications.py` (`schedule_line`, `email_subject`, `email_html`, `email_text`)
- Test: `tests/test_visit_notifications.py`

**Interfaces:**
- Produces: `is_tour(visits: list[BookedVisit]) -> bool` — more than one visit and all share one `visit_at`. Every existing function keeps its signature.

- [ ] **Step 1: Write failing tests** (`TOUR` = 4 visits all at Sat 14 Nov 18:30)
  - `test_a_tour_schedule_names_the_start_and_lists_the_homes`: `schedule_line(TOUR) == "Tour of 4 homes from Sat 14 Nov, 6:30 PM: A, B, C, D"`.
  - `test_a_long_tour_is_cut_short_with_a_count`: 5 long names → `len <= MAX_SCHEDULE_CHARS`, ends with `+N more`.
  - `test_tour_email_reads_as_one_trip`: subject `"Your Zenant home tour is booked – Sat 14 Nov"`; html contains `"Tour of 4 homes"` and `"Sat 14 Nov &middot; 6:30 PM"` exactly once; text contains `"Tour starts Sat 14 Nov, 6:30 PM"` and `"- A"`.
  - Existing different-time and single-visit tests stay unchanged.
- [ ] **Step 2:** `python -m pytest tests/test_visit_notifications.py -q` → new tests FAIL.
- [ ] **Step 3: Implement.** Tour branches only; non-tour output byte-identical to today. Tour html: one date/time line, then a row per home name without time; heading "Your home tour is booked".
- [ ] **Step 4:** same command → all PASS.
- [ ] **Step 5: Commit** `feat(website): describe a same-time cart booking as one tour`.

### Task 2: One-row tour booking in the batch endpoint (`zenant-brainback`)

**Files:**
- Modify: `api/website_api.py:407-442` (caps, quota), `:511-567` (`_book_visit`), `:633-720` (`schedule_website_visits`)
- Test: `tests/test_website_booking_notifications.py`

**Interfaces:**
- Consumes: `BookedVisit`, `notify_website_booking` (unchanged).
- Produces:
  - `_book_visit(sheet, *, name, phone, handler, properties: list[tuple[str, str]], date, visit_time, visit_at, now) -> dict` — `properties` is `[(property_id, name), ...]` in cart order; one sheet row, one mirror row (`property_id` = first id, `raw_property_name` = joined names). Returns `{"status": "scheduled" | "already_scheduled", "handled_by": ...}`. The single-visit endpoint calls it with one property.
  - Batch response: `{"status", "visit_date", "visit_time", "property_ids", "handled_by", "notified", "results": [{"property_id", "status"}...]}` (`results` kept for the old cart).
  - `_homes_in(raw_property_name: str) -> int` — count of `", "`-separated names, minimum 1.

- [ ] **Step 1: Write failing tests** (rewrite the batch tests; fake `_book_visit` records its kwargs)
  - `test_a_cart_books_one_tour_row`: new body (`visit_date`, `visit_time` 18:30, `property_ids: ["p2","p1"]`) → 201, `_book_visit` called once with `properties == [("p2","HSR-2BHK"),("p1","4THB - BTM - 1Bhk")]`; one notify with two `BookedVisit` both at 18:30 in cart order.
  - `test_the_old_cart_body_books_one_tour_at_the_earliest_time`: old `visits[]` (12:30, 11:00) → one call at 11:00; `results == [{"property_id":"p2","status":"scheduled"},{"property_id":"p1","status":"scheduled"}]`.
  - `test_a_resubmitted_tour_sends_nothing_again`: fake returns `already_scheduled` → `notified is None`.
  - `test_more_than_five_homes_is_refused` (new body, 6 ids → 400) and `test_duplicate_homes_are_refused`.
  - `test_an_unpublished_home_books_nothing`: 409, `unavailable == ["p9"]`, `_book_visit` not called.
  - `test_homes_in_counts_names`: `_homes_in("A, B, C") == 3`, `_homes_in("") == 1`.
  - Keep the email tests and single-visit endpoint test passing.
- [ ] **Step 2:** `python -m pytest tests/test_website_booking_notifications.py -q` → FAIL.
- [ ] **Step 3: Implement.** Parse new body if `property_ids` present, else old `visits[]` (tour time = earliest). Drop the same-time check. Sheet write failure → 503 (whole tour or nothing). Stable key/row hash use the joined names. Quota: `_website_visits_since` selects `raw_property_name` and sums `_homes_in`.
- [ ] **Step 4:** `python -m pytest tests -q` → all PASS.
- [ ] **Step 5: Commit** `feat(website): book a cart as one tour in one sheet row`, push backend.

### Task 3: One start time in the cart (website)

**Files:**
- Modify: `src/components/VisitListDrawer.tsx`, `src/components/exploreShared.ts:81`, cart styles in `src/` if the new block needs them.

**Interfaces:**
- Consumes: Task 2's new request body and response.

- [ ] **Step 1: Implement.** `MAX_VISIT_LIST = 5`. Replace per-home `slots` with one `{date, time}`; remove per-home selects and "(another visit)". Below the list: label "When do you want to start your tour?" (one home: "When do you want to visit?"), date + time selects, note "Our agent will plan the order of the homes and call you before the visit." (more than one home only). Button: `Book tour of N homes` / `Book visit` / `Pick a start time`. Success view: date · start time once, then home names; failure → existing error message.
- [ ] **Step 2: Verify.** `npm run build` passes; in the preview, add 2+ homes, open cart, check the single picker and button text, and that a request (intercepted or against local API) carries the new body. Check at mobile width.
- [ ] **Step 3: Commit** `feat(cart): book the whole cart as one tour with one start time`, push after the backend is deployed.
