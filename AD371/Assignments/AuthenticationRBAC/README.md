# Authentication & RBAC Demo

A lightweight full-stack application demonstrating **authentication** and **role-based access control (RBAC)** with two roles: `User` and `Admin`.

- **Backend** — Node.js (ESM + native TypeScript type-stripping), Express 5, **bcrypt** password hashing (cost 12), **JWT** bearer-token authentication (HS256, 1-hour expiry), login rate limiting, and route-guard middleware.
- **Frontend** — Vite + **Svelte 5** + **TypeScript**, with a tiny hash-based router, client-side route guards (UX only), and pages that exercise the public / protected / restricted endpoints.

## Quick start

Requires Node.js >= 22.6 (22.6+ runs TypeScript directly; developed on Node 24).

```bash
# from this folder (AuthenticationRBAC/)
npm install

# terminal 1 - API server on http://localhost:4000
npm run dev:server

# terminal 2 - frontend on http://localhost:5173
npm run dev:client
```

Open <http://localhost:5173>. The Vite dev server proxies `/api/*` to the backend.

Optional: `copy server\.env.example server\.env` and set a real `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Demo walkthrough

1. **Register** — the **first** account ever created is automatically promoted to **Admin** (bootstrap). Register a second account to get a regular **User**.
2. Registering as *Admin* after that requires the admin signup code (`AD371-ADMIN-DEMO-CODE` unless overridden via `ADMIN_SIGNUP_CODE`) — the server rejects it with `403` otherwise.
3. Log in as the **User** → open **Dashboard** (protected view) → click *"Call /api/admin/metrics"* → the **server** responds `403 Forbidden`.
4. Log out, log back in as the **Admin** → open **Admin** (restricted view) → browse the user list, system metrics, and delete users.
5. The user store is in-memory: restarting the server clears all accounts.

## Access tiers (API reference)

| Tier | Endpoint | Access |
|---|---|---|
| Public | `GET /api/health` | anyone |
| Public | `GET /api/public/stats` | anyone |
| Public | `POST /api/auth/register` | anyone (Admin role gated by signup code; first user = Admin) |
| Public | `POST /api/auth/login` | anyone (rate-limited: 5 failures / 15 min per username) |
| Protected | `GET /api/auth/me` | any authenticated user (Bearer JWT) |
| Protected | `POST /api/auth/logout` | any authenticated user |
| Protected | `GET /api/user/profile` | any authenticated user |
| Restricted | `GET /api/admin/users` | **Admin only** |
| Restricted | `DELETE /api/admin/users/:id` | **Admin only** (cannot delete self) |
| Restricted | `GET /api/admin/metrics` | **Admin only** |

### Example curl session

```bash
# register the first user (becomes Admin)
curl -s http://localhost:4000/api/auth/register -H "Content-Type: application/json" ^
  -d "{\"username\":\"root\",\"email\":\"root@example.com\",\"password\":\"supersecret123\"}"

# login
curl -s http://localhost:4000/api/auth/login -H "Content-Type: application/json" ^
  -d "{\"username\":\"root\",\"password\":\"supersecret123\"}"

# use the token
curl -s http://localhost:4000/api/user/profile -H "Authorization: Bearer <TOKEN>"
curl -s http://localhost:4000/api/admin/metrics -H "Authorization: Bearer <TOKEN>"
```


## Route-guard middleware

`server/src/middleware/auth.ts`:

- **`authenticate`** — verifies the `Authorization: Bearer <token>` header: checks JWT signature, expiry, and claims, then attaches `{ id, username, role }` to `req.user`. Rejects with `401` otherwise.
- **`requireRole(...roles)`** — authorization middleware that must run *after* `authenticate`. Rejects with `401` (no identity) or `403` (insufficient role). Usage: `router.get('/users', authenticate, requireRole('admin'), handler)`.

Ordering matters: **authenticate (authn) before authorize (authz)**. The protected tier is expressed as `userRouter.use(authenticate)`; the restricted tier as `adminRouter.use(authenticate, requireRole('admin'))`.

## Security decisions & tradeoffs

| Decision | Rationale |
|---|---|
| **bcrypt, cost 12** | Adaptive, salted hash; slow enough to blunt offline cracking while staying usable. Only the hash is stored. |
| **JWT (HS256, 1 h)** | Stateless tokens with a minimal claim set (`sub`, `username`, `role`). The signing key comes from `JWT_SECRET`; production runs fail closed if unset. |
| **Token storage in `localStorage`** | Demo simplicity. Tradeoff: any XSS can steal the token. Production should prefer `httpOnly` + `Secure` + `SameSite` cookies with CSRF protection. |
| **Login rate limiting** | 5 failed attempts per username → 15-minute lockout, to slow credential stuffing. (In-memory; use a shared store/Redis in production.) |
| **Anti user-enumeration** | Same error message and comparable response time for "unknown user" vs. "wrong password" (dummy bcrypt comparison). |
| **Admin self-registration gate** | The `role` field from public input is never trusted: Admin requires the server-side `ADMIN_SIGNUP_CODE` secret (first user bootstraps as Admin). |
| **Baseline hardening** | Generic JSON errors, `no-store` cache headers, `x-powered-by` disabled, 16 kB body limit. |

### Known limitations (by design, to stay lightweight)

- In-memory user store and throttle — restarts wipe data; no persistence layer.
- No email verification, password reset, MFA, or token revocation/blacklist (stateless JWT).
- CORS is permissive for the local demo; restrict origins in production.
- Passwords travel over plain HTTP in local development — always serve over HTTPS in production.

## Project layout

```
AuthenticationRBAC/
├─ package.json              # npm workspaces root (server + client)
├─ server/                   # Node.js + Express + TypeScript (type-stripped)
│  ├─ src/
│  │  ├─ index.ts            # app setup, hardening, route mounting
│  │  ├─ config.ts           # env-driven configuration
│  │  ├─ middleware/auth.ts  # authenticate + requireRole guards
│  │  ├─ routes/             # auth, public, user (protected), admin (restricted)
│  │  ├─ store/users.ts      # in-memory user store (bcrypt hashes only)
│  │  ├─ utils/passwords.ts  # bcrypt hash/verify + timing equalization
│  │  └─ utils/loginThrottle.ts
│  └─ tsconfig.json
└─ client/                   # Vite + Svelte 5 + TypeScript
   ├─ src/
   │  ├─ App.svelte          # hash router + client-side route guards
   │  ├─ components/NavBar.svelte
   │  ├─ pages/              # Home, Login, Register, Dashboard, Admin, NotFound
   │  ├─ stores/             # auth.svelte.ts (session), router.svelte.ts
   │  └─ lib/                # api.ts (fetch + JWT header), types.ts
   └─ vite.config.ts         # dev proxy /api -> localhost:4000
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev:server` | Start the API with file-watch on port 4000 |
| `npm run dev:client` | Start the Vite dev server on port 5173 |
| `npm run typecheck:server` | `tsc --noEmit` for the backend |
| `npm run check:client` | `svelte-check` for the frontend |
