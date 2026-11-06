# Airbnb Clone (React + TypeScript)

A plain client-side React app (Vite + TypeScript), converted from a Next.js app.
No server-side rendering, no file-based routing — routes are defined explicitly
with `react-router-dom` in `src/App.tsx`.

## What changed from the Next.js version

- **Routing**: Next.js's file-based `app/` routing (`page.jsx`, `layout.jsx`) is
  replaced by `react-router-dom`. Routes live in `src/App.tsx`:
  - `/` → `src/pages/Home.tsx` (rentals list + search)
  - `/bookings` → `src/pages/Bookings.tsx` (list of bookings)
  - `/bookings/add` → `src/pages/AddBooking.tsx` (booking form)
- **Layout**: the old `layout.jsx` (header + nav) is now `src/components/Layout.tsx`,
  wrapping the routed pages in `App.tsx` instead of being picked up automatically.
- **`next/link`** → `react-router-dom`'s `Link`, pointing at the routes above.
- **`next/image`** and `next/font` aren't used (this isn't a Next.js app), and the
  default Next.js starter page/boilerplate CSS module was dropped as unrelated to
  the rental app itself.
- **TypeScript**: every component and context is typed. Shared `Rental` and
  `Booking` interfaces live in `src/types/index.ts`. Contexts
  (`RentalContext`, `BookingContext`) throw if used outside their provider,
  and are properly typed via generics on `createContext`.
- **`"use client"`** directives are removed — meaningless outside Next.js.

## Notes

- `src/components/BookingForm.tsx` is a standalone, reusable version of the
  booking form (takes `rentals`/`updateBookings` as props) — kept from the
  original file set alongside the context-driven version used on the
  `/bookings/add` page.
- The Home page fetches rentals from `http://localhost:3001/rentals` (as in
  the original) — point this at your own API, or swap in mock data.

## Run it

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```
