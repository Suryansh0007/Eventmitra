# EventMitra — React Frontend

A React (Vite) frontend for your `EventMitra` Spring Boot backend. It calls the
real API — registration/OTP, login (JWT), browsing events, booking tickets,
Razorpay payment, "My Bookings", and an Admin dashboard — using the exact
endpoints and field names from your controllers/DTOs.

## 1. Run the backend first

```
cd EventMitra
mvn spring-boot:run
```

Make sure MySQL is running and `application.properties` credentials match your
local setup. The API will be at `http://localhost:8080`.

### Fix CORS (required — one-time backend change)

Your backend currently has no CORS configuration, so the browser will block
every request from React. Two small changes fix this — see the
`backend-fix/` folder shared alongside this project:

1. Copy `CorsConfig.java` into `src/main/java/com/eventmitra/config/`.
2. Edit `SecurityConfig.java` as described in `SecurityConfig-CHANGES.md`
   (adds `.cors(...)` and permits `OPTIONS` preflight requests).

Restart the backend after making these changes.

## 2. Run the frontend

```
cd eventmitra-frontend
npm install
npm run dev
```

This starts the app at `http://localhost:5173`. It's already configured (via
`.env`) to call the backend at `http://localhost:8080`. If your backend runs
on a different host/port, edit `.env`:

```
VITE_API_BASE_URL=http://localhost:8080
```

## 3. Try it out

1. Register a user (pick "Customer", "Organizer", or "Admin").
2. The app calls `/otp/send` automatically and takes you to the OTP screen.
   Your backend's `OtpServiceImpl` uses a **mock** OTP service — check your
   backend console/logs for the generated code (it isn't actually emailed).
3. Verify the OTP, then log in.
4. To see events on the Home/Events pages, an ADMIN or ORGANIZER account
   needs to create events + ticket types first (via Postman, or by wiring up
   an admin "create event" form — not included yet, see below).
5. As an ATTENDEE: browse events -> pick a ticket type/quantity -> Book Now ->
   Booking Summary -> Payment (Razorpay Checkout).
6. As an ADMIN: visit `/admin` for stats, users, events, bookings, payments,
   and refund approvals.

### Razorpay payment

The Payment page loads the real Razorpay Checkout script and calls your
`/payments/create-order` and `/payments/verify` endpoints. Your
`application.properties` currently has placeholder keys
(`rzp_test_key` / `rzp_test_secret`), which won't open a real checkout —
sign up at razorpay.com for free test keys and drop them in
`application.properties` to see the full payment flow work end to end.

## What's included

- Full auth flow: register -> OTP verify -> login (JWT stored in
  `localStorage`, attached to every request automatically)
- Home page with popular events, Events page with search/category filter
- Event details with ticket selection + live total
- Booking summary -> Razorpay payment -> confirmation
- My Bookings with cancel/refund request
- Admin dashboard: stats, users, events, bookings, payments, refund
  approve/reject

## What's not included (kept out of scope)

- Admin/organizer forms to **create/edit events and ticket types** (your
  backend supports this via `POST /events` and `POST /tickets` — the
  dashboard currently only *lists* them). Say the word if you'd like these
  added.
- Event category images — cards use gradient placeholders instead of stock
  photos, to keep things copyright-safe and fast-loading.

## Project structure

```
src/
  api/            axios calls, one file per backend controller
  context/        AuthContext (JWT + role, persisted to localStorage)
  components/     Navbar, Footer, ProtectedRoute, EventCard
  pages/          one file per screen (Home, Events, EventDetails, Register,
                  VerifyOtp, Login, BookingSummary, Payment, MyBookings,
                  AdminDashboard, NotFound)
  utils/format.js currency/date formatting helpers
```
