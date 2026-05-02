# Dashboard Day-by-Day Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow the admin dashboard to navigate "Arrivées" and "Départs" lists day by day (past and future) via shared arrows above the two cards, without re-rendering the whole dashboard.

**Architecture:** Add a Next.js server action that returns arrivals/departures for any given date. The dashboard client holds the selected date in state, calls the action on prev/next/today clicks, and updates only the two cards. Stats cards and revenue chart stay frozen on initial server render.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Supabase (server client) · Tailwind · date-fns

**Spec:** `docs/superpowers/specs/2026-05-02-dashboard-day-navigation-design.md`

**Project has no automated test framework** — verification is manual via `npm run dev` and browsing `/admin`.

---

## File Structure

- **Create:** `app/admin/actions.ts` — server action `getDayReservations(dateStr)`.
- **Modify:** `app/admin/dashboard-client.tsx` — add state, handlers, `<DayNavigator>` sub-component, dynamic card titles, updated `downloadPDF`.
- **Unchanged:** `app/admin/page.tsx` — continues to fetch today's data for initial render.

---

### Task 1: Create the server action

**Files:**
- Create: `app/admin/actions.ts`

- [ ] **Step 1: Write the server action**

Create `app/admin/actions.ts` with this exact content:

```ts
"use server";

import { createClient } from "@/utils/supabase/server";

export type DayReservation = {
  id: string;
  start_date: string;
  end_date: string;
  vehicle_type: string;
  vehicle_plate: string;
  vehicle_brand: string;
  vehicle_model: string;
  status: string;
  number: string;
  return_flight_number: string | null;
  number_of_people: number | null;
  users: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
};

export async function getDayReservations(dateStr: string): Promise<{
  arrivals: DayReservation[];
  departures: DayReservation[];
}> {
  const supabase = await createClient();

  const { data: arrivals } = await supabase
    .from("reservations")
    .select("*, users!inner(first_name, last_name, email, phone)")
    .gte("start_date", `${dateStr}T00:00:00`)
    .lt("start_date", `${dateStr}T23:59:59`)
    .in("status", ["confirmed", "pending"])
    .order("start_date", { ascending: true });

  const { data: departures } = await supabase
    .from("reservations")
    .select("*, users!inner(first_name, last_name, email, phone)")
    .gte("end_date", `${dateStr}T00:00:00`)
    .lt("end_date", `${dateStr}T23:59:59`)
    .in("status", ["confirmed", "completed"])
    .order("end_date", { ascending: true });

  return {
    arrivals: (arrivals || []) as DayReservation[],
    departures: (departures || []) as DayReservation[],
  };
}
```

Note: the query logic is copied verbatim from `app/admin/page.tsx:27-42`. Keep the exact same `.gte` / `.lt` boundaries and `.in("status", ...)` filters so today's behaviour is unchanged.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors. If errors mention `@/utils/supabase/server`, confirm the import path matches `app/admin/page.tsx:1`.

- [ ] **Step 3: Commit**

```bash
git add app/admin/actions.ts
git commit -m "Add getDayReservations server action for dashboard day navigation"
```

---

### Task 2: Move the Reservation type to a shared location

**Why:** `dashboard-client.tsx` already defines `Reservation` locally (`app/admin/dashboard-client.tsx:18-36`). The server action's `DayReservation` type is identical. To avoid drift, replace the local type with an import.

**Files:**
- Modify: `app/admin/dashboard-client.tsx:18-36` (remove the `type Reservation = { ... }` block)
- Modify: `app/admin/dashboard-client.tsx` (add import from actions, replace `Reservation` references with `DayReservation`)

- [ ] **Step 1: Replace the local type with an import**

In `app/admin/dashboard-client.tsx`, find this block (lines 18-36):

```ts
type Reservation = {
  id: string;
  start_date: string;
  end_date: string;
  vehicle_type: string;
  vehicle_plate: string;
  vehicle_brand: string;
  vehicle_model: string;
  status: string;
  number: string;
  return_flight_number: string | null;
  number_of_people: number | null;
  users: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
};
```

Replace it with:

```ts
import type { DayReservation } from "./actions";

type Reservation = DayReservation;
```

(We keep the `Reservation` alias to avoid touching every existing reference in the file.)

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/admin/dashboard-client.tsx
git commit -m "Share Reservation type between dashboard client and server action"
```

---

### Task 3: Add date helpers and state to the dashboard client

**Files:**
- Modify: `app/admin/dashboard-client.tsx` (add imports, helpers, state in the component body)

- [ ] **Step 1: Add `useEffect` and the server action import**

At the top of `app/admin/dashboard-client.tsx`, change:

```ts
import { useState } from "react";
```

to:

```ts
import { useState, useEffect, useCallback } from "react";
import { getDayReservations } from "./actions";
```

- [ ] **Step 2: Add date helpers above the `DashboardClient` component**

Insert these helpers immediately above `export default function DashboardClient(...)` (so right after `downloadPDF` ends — after line 124):

```ts
function toDateStr(date: Date): string {
  // Local YYYY-MM-DD (avoids UTC shift around midnight).
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return toDateStr(a) === toDateStr(b);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatLongDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(date: Date): string {
  // e.g. "5 mai"
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/admin/dashboard-client.tsx
git commit -m "Add date helpers for dashboard day navigation"
```

---

### Task 4: Add `DayNavigator` sub-component

**Files:**
- Modify: `app/admin/dashboard-client.tsx` (add component below the date helpers)

- [ ] **Step 1: Add the `DayNavigator` component**

Insert this component right after the date helpers from Task 3 (still above `DashboardClient`):

```tsx
function DayNavigator({
  date,
  onPrev,
  onNext,
  onToday,
  isToday,
  isLoading,
}: {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  isToday: boolean;
  isLoading: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-3 bg-card rounded-2xl border border-border px-4 py-3">
      <button
        onClick={onPrev}
        disabled={isLoading}
        className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Jour précédent"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <p className="text-sm font-bold text-foreground capitalize min-w-[14rem] text-center">
        {formatLongDate(date)}
      </p>

      <button
        onClick={onNext}
        disabled={isLoading}
        className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Jour suivant"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {!isToday && (
        <button
          onClick={onToday}
          disabled={isLoading}
          className="ml-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          Aujourd&apos;hui
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/admin/dashboard-client.tsx
git commit -m "Add DayNavigator component for dashboard"
```

---

### Task 5: Wire state, handlers, and dynamic card data

**Files:**
- Modify: `app/admin/dashboard-client.tsx` — body of `DashboardClient` + grid of the two cards.

- [ ] **Step 1: Add state and handlers at the top of `DashboardClient`**

Find the start of `export default function DashboardClient({ data }: { data: DashboardData })` (around line 126). Replace the body opening (down to the first `return`) so that the function reads:

```tsx
export default function DashboardClient({ data }: { data: DashboardData }) {
  const occupancyPercent =
    data.totalCapacity > 0
      ? Math.round((data.currentlyParked / data.totalCapacity) * 100)
      : 0;

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [arrivals, setArrivals] = useState<Reservation[]>(data.todayArrivals);
  const [departures, setDepartures] = useState<Reservation[]>(
    data.todayDepartures
  );
  const [isLoading, setIsLoading] = useState(false);

  const isToday = isSameDay(selectedDate, today);

  const loadDay = useCallback(async (date: Date) => {
    setIsLoading(true);
    try {
      const { arrivals: a, departures: d } = await getDayReservations(
        toDateStr(date)
      );
      setArrivals(a);
      setDepartures(d);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSameDay(selectedDate, new Date())) return;
    loadDay(selectedDate);
  }, [selectedDate, loadDay]);

  const goPrev = () => setSelectedDate((d) => addDays(d, -1));
  const goNext = () => setSelectedDate((d) => addDays(d, 1));
  const goToday = () => setSelectedDate(new Date());

  return (
```

Notes:
- The initial `today` is captured once on render; the "go to today" button creates a fresh `new Date()` so day rollovers still work.
- The `useEffect` skips refetching when we land back on today (the props already hold today's data).

- [ ] **Step 2: Insert `<DayNavigator>` above the cards grid**

Find the comment `{/* Arrivals & Departures */}` and the grid that follows (around line 386):

```tsx
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
```

Immediately *before* that `<div>`, insert:

```tsx
      <DayNavigator
        date={selectedDate}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        isToday={isToday}
        isLoading={isLoading}
      />

```

- [ ] **Step 3: Replace `data.todayDepartures` and `data.todayArrivals` references in the cards**

Inside the cards grid, replace **all four** references to `data.todayDepartures` (the count badge, the empty-state check, and the `.map(...)` call) with `departures`.

Specifically:

- Line ~396: `{data.todayDepartures.length}` → `{departures.length}`
- Line ~401 (the `downloadPDF` call inside the "Arrivées" card — the file currently passes departures here, see Task 6 below): keep for now, will be replaced in Task 6.
- Line ~424: `data.todayDepartures.length === 0` → `departures.length === 0`
- Line ~448: `data.todayDepartures.map((res) => (` → `departures.map((res) => (`

Then do the symmetric replacement for arrivals (the "Départs aujourd'hui" card uses `data.todayArrivals`):

- Line ~500: `{data.todayArrivals.length}` → `{arrivals.length}`
- Line ~504 `downloadPDF(data.todayArrivals, ...)` → keep for Task 6.
- Line ~526: `data.todayArrivals.length === 0` → `arrivals.length === 0`
- Line ~550: `data.todayArrivals.map((res) => (` → `arrivals.map((res) => (`

> ⚠️ The existing file has the labels swapped: the card titled **"Arrivées aujourd'hui"** currently iterates `data.todayDepartures`, and the card titled **"Départs aujourd'hui"** iterates `data.todayArrivals`. This swap is intentional and was committed as a working bug-fix — do **not** rename variables across cards. Only swap `data.todayX` → local `X` while preserving the existing pairing.

- [ ] **Step 4: Add loading opacity to the two card list containers**

Find both `<div className="divide-y divide-border max-h-80 overflow-y-auto">` (around lines 447 and 549). Replace each with:

```tsx
<div
  className={`divide-y divide-border max-h-80 overflow-y-auto transition-opacity ${
    isLoading ? "opacity-50" : "opacity-100"
  }`}
>
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add app/admin/dashboard-client.tsx
git commit -m "Wire dashboard cards to selected day with prev/next/today controls"
```

---

### Task 6: Make card titles dynamic and update PDF export

**Files:**
- Modify: `app/admin/dashboard-client.tsx` — `downloadPDF` signature, card titles, PDF button calls.

- [ ] **Step 1: Update `downloadPDF` to accept a `date` and use it everywhere**

Find the existing `downloadPDF` function (`app/admin/dashboard-client.tsx:70-124`). Replace the entire function with:

```tsx
function downloadPDF(
  reservations: Reservation[],
  kind: "arrivals" | "departures",
  date: Date
) {
  const doc = new jsPDF();
  const isArrival = kind === "arrivals";
  const longDate = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const title = isArrival ? `Arrivées du ${longDate}` : `Départs du ${longDate}`;

  doc.setFontSize(16);
  doc.text(`ParkAero Direct — ${title}`, 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(longDate, 14, 28);

  if (reservations.length === 0) {
    doc.setFontSize(12);
    doc.setTextColor(150);
    doc.text("Aucune réservation", 14, 45);
  } else {
    autoTable(doc, {
      startY: 35,
      head: [
        isArrival
          ? ["Heure", "Client", "Téléphone", "Véhicule", "Plaque", "Vol retour", "Pers.", "Statut"]
          : ["Heure", "Client", "Téléphone", "Véhicule", "Plaque", "Pers.", "Statut"],
      ],
      body: reservations.map((r) => {
        const row = [
          formatTime(isArrival ? r.end_date : r.start_date),
          `${r.users?.first_name || ""} ${r.users?.last_name || ""}`,
          r.users?.phone || "—",
          `${formatVehicle(r.vehicle_type)} ${r.vehicle_brand || ""} ${r.vehicle_model || ""}`.trim(),
          r.vehicle_plate || "—",
        ];
        if (isArrival) {
          row.push(r.return_flight_number || "—");
        }
        row.push(String(r.number_of_people || "1"));
        row.push(
          r.status === "confirmed"
            ? "Confirmé"
            : r.status === "pending"
              ? "En attente"
              : r.status
        );
        return row;
      }),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [14, 165, 233] },
    });
  }

  const filePrefix = isArrival ? "arrivees" : "departs";
  doc.save(`${filePrefix}-${toDateStr(date)}.pdf`);
}
```

Key changes from the original:
- New `kind: "arrivals" | "departures"` parameter — replaces the brittle `title.includes("Arrivée")` checks.
- New `date: Date` parameter — used for title text and filename.
- File name uses `toDateStr(date)` (the helper added in Task 3) instead of `new Date().toISOString().split("T")[0]`.

- [ ] **Step 2: Update the two `downloadPDF` call sites and the card titles**

In the **Arrivées** card (the one labelled `Arrivées aujourd'hui` — currently around line 393):

Find:
```tsx
<h2 className="text-sm font-bold text-foreground">
  Arrivées aujourd&apos;hui
</h2>
```

Replace with:
```tsx
<h2 className="text-sm font-bold text-foreground capitalize">
  {isToday ? "Arrivées aujourd'hui" : `Arrivées du ${formatShortDate(selectedDate)}`}
</h2>
```

Find (around line 400):
```tsx
onClick={() =>
  downloadPDF(data.todayDepartures, "Arrivées du jour")
}
```

Replace with:
```tsx
onClick={() => downloadPDF(departures, "arrivals", selectedDate)}
```

(Reminder: `departures` here is correct — see the swap warning in Task 5 step 3.)

In the **Départs** card (labelled `Départs aujourd'hui` — currently around line 497):

Find:
```tsx
<h2 className="text-sm font-bold text-foreground">
  Départs aujourd&apos;hui
</h2>
```

Replace with:
```tsx
<h2 className="text-sm font-bold text-foreground capitalize">
  {isToday ? "Départs aujourd'hui" : `Départs du ${formatShortDate(selectedDate)}`}
</h2>
```

Find (around line 504):
```tsx
onClick={() => downloadPDF(data.todayArrivals, "Départs du jour")}
```

Replace with:
```tsx
onClick={() => downloadPDF(arrivals, "departures", selectedDate)}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors. If TS complains about an unused parameter from the old signature, double-check that the entire function body was replaced.

- [ ] **Step 4: Commit**

```bash
git add app/admin/dashboard-client.tsx
git commit -m "Make dashboard card titles and PDF export reflect selected day"
```

---

### Task 7: Manual verification

**Files:** none modified — this is a verification task. Do NOT commit anything.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: server starts on `http://localhost:3000`.

- [ ] **Step 2: Open the admin dashboard**

Navigate to `http://localhost:3000/admin` (log in if required).

Expected:
- Stats cards, revenue chart, and the two arrival/departure cards render as before.
- A new bandeau appears between the chart and the two cards: `[◀] Samedi 2 mai 2026 [▶]`.
- The "Aujourd'hui" button is **not** visible.
- Card titles read "Arrivées aujourd'hui" / "Départs aujourd'hui".

- [ ] **Step 3: Click ▶ once**

Expected:
- Date label updates to next day (e.g. "Dimanche 3 mai 2026").
- "Aujourd'hui" button appears.
- The two cards' lists fade (opacity 50%) briefly, then update to that day's reservations (or the empty state).
- Card titles change to "Arrivées du 3 mai" / "Départs du 3 mai".
- Stats cards and chart do **not** flicker or change.

- [ ] **Step 4: Click ◀ multiple times to go into the past**

Expected: navigation works without errors; lists update each time. Past dates show historical reservations (status `completed` for departures, `confirmed`/`pending` for arrivals — same filters as today).

- [ ] **Step 5: Click "Aujourd'hui"**

Expected:
- Date label returns to today.
- "Aujourd'hui" button disappears.
- Card titles return to "Arrivées aujourd'hui" / "Départs aujourd'hui".

- [ ] **Step 6: Test the PDF export on a non-today date**

- Click ▶ once.
- Click the "PDF" button on the Arrivées card.

Expected:
- PDF downloads with filename `arrivees-YYYY-MM-DD.pdf` matching the selected day.
- PDF title reads `ParkAero Direct — Arrivées du <day> <month> <year>` matching the selected day.
- Rows match what the card displays.

Repeat for the Départs card.

- [ ] **Step 7: Stop the dev server**

`Ctrl+C` in the terminal running `npm run dev`.

If any step fails, fix the issue, run `npx tsc --noEmit`, commit the fix, and re-run verification from Step 2.

---

## Self-Review Checklist (already performed)

- **Spec coverage:** Every spec section maps to a task — server action (Task 1), state & navigator (Tasks 3-5), dynamic titles & PDF (Task 6), manual verification matches the spec's "Tests / vérification manuelle" section (Task 7).
- **Type consistency:** `DayReservation` defined in Task 1 is imported and aliased to `Reservation` in Task 2; subsequent tasks use `Reservation` throughout. Helpers `toDateStr`, `isSameDay`, `addDays`, `formatLongDate`, `formatShortDate` are defined in Task 3 and used unchanged in Tasks 4, 5, 6.
- **Swap warning preserved:** The pre-existing arrivals/departures label-vs-data swap in `dashboard-client.tsx` is documented in Task 5 Step 3 so the implementer doesn't "fix" it.
- **No placeholders:** every code block is complete; no TODO/TBD; commands include expected output.
