# Cart booking as one tour, one sheet row

Date: 2026-11-27
Repos: this website repo (cart UI) and `zenant-brainback` (booking API, notifications)

## Why

Today the cart asks for a separate date and time for every home, and a time picked for one
home is disabled for the others. The booking API also rejects two visits at the same time.
So a customer booking several homes is forced to invent a schedule. On 14 Nov, one
customer booked 5 homes at 6:30, 7:00, 7:30, 8:00 PM and 1:30 PM next day, across BTM,
Koramangala and JP Nagar. Nobody can travel between those homes in 30 minutes, and the
sheet filled with 5 rows that read as 5 separate visits.

What actually happens is that one agent takes the customer round all the homes in one
trip, so the booking should be one tour, with one start time and one sheet row.

## Goals

- The customer picks **one date and one start time** for everything in the cart.
- A cart booking writes **one row** in the visits sheet, with every home in the Property
  cell, separated by commas.
- The confirmation on WhatsApp and email describes it as one tour starting at that time.

## Non-goals

- The website does not plan the order of homes or estimate travel time. The agent does that.
- No change to booking a single home from a property page (`POST /api/public/visits`).
- No change to how the WhatsApp bot books visits.

## Anti-goals

- Website rows must not look different from WhatsApp rows. The sheet sync, dashboard and
  reminders must keep working without changes.
- A customer must not lose a booking because of the switch (old cart and new API, or new
  cart and old API, during rollout).

## Constraints found in the code

- The WhatsApp bot already writes one row per booking. It adds each new home to the same
  row, joined with `", "` (`zenant-brainback/domain/tools.py:191-212`). The sheet sync
  (`api/sheet_sync.py`), the dashboard and the visit reminders (`services/visit_reminders.py`)
  already treat the Property cell as plain text, so a comma-separated list needs no
  change there.
- Website bookings also write a mirror row into Supabase `sheet_visits`, with a single
  `property_id` column (`api/website_api.py:551`). Nothing in the dashboard reads
  `property_id`.
- The per-phone (10 a day) and per-hour (60) booking limits count `sheet_visits` rows
  (`api/website_api.py:416-442`). With one row per tour they would count tours, not homes.
- Notifications (`services/visit_notifications.py`) take a list of `BookedVisit`, each
  with its own time, and print one line per home with its time.

## Approaches considered

1. **One row per home, same start time on each row, with a tour marker ("Tour 1 of 4").**
   Keeps a status for each home, but the sheet still shows 4 rows for one trip. Rejected
   by the team, who want a single row.
2. **One row per tour, homes comma-separated in the Property cell (chosen).** It matches
   what the WhatsApp bot already writes, so nothing downstream changes. The cost is one
   status for the whole tour: the agent can't mark a single skipped home as cancelled.
   WhatsApp rows already work this way.
3. **A new "tours" sheet or table that links to visits.** Most flexible, but it means changing
   the sync, the dashboard and how the team works in the sheet. Far too big for the problem.

## Design

### Cart (website repo)

- `src/components/VisitListDrawer.tsx`: remove the date and time selects from each home.
  Below the list of homes, add one block: "When do you want to start your tour?" with one
  date select and one time select. It uses the same `bookingDates`, `TIME_SLOTS` and
  `isSlotAvailable` rules as today. Under it, the line: "Our agent will plan the order of
  the homes and call you before the visit."
- Replace the per-home `slots` state with one `{ date, time }`. Drop the "(another visit)"
  logic.
- Submit button: "Book tour of N homes" (or "Book visit" for one home). Until a time is
  picked: "Pick a start time".
- Request body to `/api/public/visits/batch`:
  ```json
  { "name": "...", "phone": "...", "email": "...", "move_in_date": "YYYY-MM-DD",
    "visit_date": "YYYY-MM-DD", "visit_time": "HH:MM",
    "property_ids": ["...", "..."] }
  ```
- Success screen: one line with the date and start time, then the list of homes. No time
  per home.
- `src/components/exploreShared.ts`: `MAX_VISIT_LIST` goes from 10 to 5. A cart saved in
  the browser with more than 5 homes keeps the first 5 (the slice already exists in
  `ExplorePage.tsx:60`).

### Booking API (`zenant-brainback/api/website_api.py`)

- `POST /visits/batch` accepts the new body: top-level `visit_date` and `visit_time`, plus
  `property_ids` (1 to 5 entries, no duplicates). `MAX_VISITS_PER_BOOKING` becomes 5.
- **Still accepts the old body** (`visits: [{property_id, visit_date, visit_time}]`) so the
  old cart keeps working while the two deploys go out. In that case the tour starts at the
  earliest of the times sent, and the old 10-home limit stays for that shape only. To be
  removed once the new cart has been live for a few days.
- Remove the "Two visits are at the same time" check.
- Write **one** sheet row:
  `[timestamp, name, mobile, "Website", "Home A, Home B, Home C", handler, date, time, "Scheduled"]`.
  Home names are in the order the customer added them to the cart.
- Always start a new row. The website does not add homes to an existing "Scheduled" row
  the way the WhatsApp bot does, because the customer picked a new date and time.
- Duplicate protection: the stable key covers the timestamp, mobile and the full property
  list, so resubmitting the same booking still returns `already_scheduled`.
- Supabase mirror: one `sheet_visits` row with `raw_property_name` set to the comma list,
  and `property_id` set to the first home's id.
- Booking limits: count homes, not rows. The per-phone and per-hour checks sum the number
  of homes in each website row (split `raw_property_name` on `", "`), so the caps keep
  their current meaning (10 homes a day per phone, 60 an hour site-wide).
- Response: `{ "status": "scheduled" | "already_scheduled", "visit_date", "visit_time",
  "property_ids": [...], "handled_by", "notified" }`. It no longer has a result for each
  home: the row is written for the whole tour or not at all.

### Notifications (`zenant-brainback/services/visit_notifications.py`)

- When several homes share one start time, the WhatsApp message and email say
  "Tour of N homes starting Sat 14 Nov, 6:30 PM" and then list the home names without
  times. A single home reads as it does today.
- The agent's WhatsApp alert gets the comma-separated home names, the same as a WhatsApp
  booking.

## Rollout

1. Deploy the backend first: it accepts both the old and new request bodies.
2. Deploy the website.
3. After a few days, remove support for the old body.

## Left to the builder

- Exact wording and layout of the start-time block, within the site's existing styles.
- How the old-body fallback is structured in code.
- Tests: the new body, the old body, duplicate resubmission, quota counting by homes, and
  the tour wording in notifications.
