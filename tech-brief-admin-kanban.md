# Technical Brief: Admin Kanban & Contacts

**Status:** Draft
**Date:** 2026-05-22
**Product Brief:** product-brief-bazaar.md
**Stack:** React (Vite) + @dnd-kit + Node.js/Express + Clerk + Neon (Postgres) + Cloudinary

---

## Overview

Phase 3. Covers the shop owner experience: protected admin routes, the Kanban order board, order status updates, and the buyer contacts list. Auth is enforced via Clerk's `admin` role — shop owners are manually assigned this role in the Clerk dashboard.

## System Architecture

```
Browser (shop owner)
  → /admin (protected — Clerk admin role required)
    Kanban board
      → GET /api/admin/orders     → Express (Clerk middleware) → Neon
      → PATCH /api/admin/orders/:id/status → Express → Neon
  → /admin/contacts
      → GET /api/admin/buyers     → Express (Clerk middleware) → Neon
```

| Component | Type | Role |
|-----------|------|------|
| Clerk middleware | Express middleware | Validates JWT, checks admin role on all /api/admin/* routes |
| @dnd-kit | React library | Drag and drop between Kanban columns |
| /admin/* | React pages | Shop owner UI — protected client-side by Clerk |
| /api/admin/* | Express routes | Shop owner API — protected server-side by Clerk JWT |

---

## Auth & Role Model

Clerk manages all auth. The `admin` role is manually assigned to shop owners in the Clerk dashboard. No self-serve role assignment.

**Client-side protection:** Clerk's `useAuth()` hook checks the role. If not admin, redirect to `/`.

**Server-side protection:** Every `/api/admin/*` route runs a middleware that:
1. Validates the Clerk JWT from the `Authorization` header
2. Checks the JWT's `role` claim for `admin`
3. Returns `401` if no token, `403` if wrong role

Store scoping: the shop owner's `clerk_user_id` is extracted from the JWT and used to look up their `stores` row. All admin queries are scoped to that store — a shop owner only sees their own orders and buyers.

---

## Data Model

No new tables. Relies on schema from `tech-brief-marketplace-core.md`.

Key join for admin order queries — recovering which orders contain this store's products:

```sql
SELECT DISTINCT o.*
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
JOIN stores s ON s.id = p.store_id
WHERE s.clerk_user_id = $1
```

Each order card shows only the items belonging to this store (filtered in the same join), not items from other stores in the same order.

---

## API Design

```
GET /api/admin/orders
Auth: required — Clerk JWT with admin role

Response: [
  {
    "id": uuid,
    "status": string,
    "total": number,
    "created_at": timestamp,
    "buyer": {
      "id": uuid,
      "name": string,
      "email": string,
      "clerk_user_id": string | null    // null = guest
    },
    "items": [
      {
        "product_id": uuid,
        "product_name": string,
        "quantity": integer,
        "price_at_purchase": number
      }
    ]
  }
]

Note: items filtered to this store's products only. total is the full order total.

Errors:
- 401: missing token
- 403: not admin role
- 500: DB failure
```

```
PATCH /api/admin/orders/:id/status
Auth: required — Clerk JWT with admin role

Request:  { "status": "new" | "processing" | "shipped" | "completed" }
Response: { "id": uuid, "status": string }

Errors:
- 400: invalid status value
- 401: missing token
- 403: not admin or order doesn't belong to this store
- 404: order not found
- 500: DB failure
```

```
GET /api/admin/buyers
Auth: required — Clerk JWT with admin role

Response: [
  {
    "id": uuid,
    "name": string,
    "email": string,
    "clerk_user_id": string | null,    // null = guest
    "latest_order_status": string
  }
]

Note: only buyers who have ordered from this store.

Errors:
- 401: missing token
- 403: not admin role
- 500: DB failure
```

---

## Security

- **Auth:** Clerk JWT on all `/api/admin/*` routes. Validated server-side on every request.
- **Authorization:** Store scoping — shop owners can only read/update orders that contain their products. `PATCH` verifies the order belongs to this store before updating.
- **Sensitive data:** Buyer email and address only exposed on admin endpoints, never on public routes.
- **Compliance:** Nothing special at this stage.

---

## Performance & Scalability

- **Expected load:** Low — one shop owner, occasional use.
- **Latency target:** Not set.
- **Caching:** Not needed yet.
- **Bottleneck:** The multi-join order query could get slow at scale — add index on `products.store_id` and `order_items.product_id`.

---

## Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| Order contains items from multiple stores | Each store sees only their items on the card. Order total shown as-is (full order total). |
| Shop owner tries to update status of an order with no items from their store | 403 — not authorized |
| Two shop owners update the same combined order status simultaneously | Last write wins — no locking. Flag as known limitation. |
| Buyer is a guest | `clerk_user_id` is null — show "Guest" badge in UI |
| Shop owner has no orders yet | Return empty array — UI shows empty state |

---

## Key Decisions & Tradeoffs

### Clerk role checked server-side on every request
- **Chosen:** Middleware validates JWT + role claim on all `/api/admin/*` routes.
- **Alternatives:** Trust client-side role check only.
- **Rationale:** Client-side checks are UI convenience only — server must be the authority.
- **Tradeoff:** Slightly more latency per request due to JWT validation. Negligible in practice.
- **Reversible?** N/A — this is the correct approach.

### Shared order status across stores
- **Chosen:** One status field on `orders` — any store owner with items in the order can update it.
- **Alternatives:** Per-store status (e.g. `order_store_status` junction table).
- **Rationale:** Keeps the model simple. Agreed in product brief — combined order means shared status.
- **Tradeoff:** If Store A marks an order "Shipped", it affects Store B's view even if Store B hasn't shipped yet. No conflict resolution in Phase 3.
- **Reversible?** Partially — adding per-store status later requires a schema change and Kanban refactor.

### @dnd-kit for drag and drop
- **Chosen:** @dnd-kit.
- **Alternatives:** react-beautiful-dnd (unmaintained), custom drag implementation.
- **Rationale:** Actively maintained, accessible by default, works well with React.
- **Tradeoff:** Some boilerplate to set up sensors and collision detection. Worth it over a dead library.
- **Reversible?** Yes — UI only, doesn't touch the data model.

---

## Build Phases

### Phase 1 — Clerk Middleware & Route Protection
Set up server-side auth so all `/api/admin/*` routes are protected before building anything on top.

**Deliverables:**
- Express middleware that validates Clerk JWT and checks `admin` role
- Returns `401` if no token, `403` if not admin
- Client-side `/admin` route redirects non-admins to `/`

### Phase 2 — Product Management
Shop owners can add products to their store before any orders exist. Image uploads go to Cloudinary — the client uploads directly to Cloudinary, gets back a URL, then sends that URL to the API.

**Deliverables:**
- `/admin/products` page listing this store's products
- `/admin/products/new` form with fields: name, description, price, image (upload), category, stock
- Image uploaded client-side to Cloudinary → URL stored in `products.image_url`
- `POST /api/admin/products` — creates product scoped to shop owner's store
- `PATCH /api/admin/products/:id` — edit existing product
- `DELETE /api/admin/products/:id` — remove product

```
POST /api/admin/products
Auth: required — Clerk JWT with admin role

Request: {
  "name": string,
  "description": string,
  "price": number,
  "image_url": string,
  "category": string,
  "stock": integer
}

Response: { "id": uuid }

Errors:
- 400: missing required fields
- 401: missing token
- 403: not admin
- 500: DB failure
```

### Phase 3 — Orders API
Build the admin order endpoints so the Kanban has real data to work with.

**Deliverables:**
- `GET /api/admin/orders` — returns orders scoped to this store, items filtered to store's products, buyer info joined
- `PATCH /api/admin/orders/:id/status` — updates order status, verifies store ownership

### Phase 4 — Kanban Board
Build the drag-and-drop order board.

**Deliverables:**
- `/admin` page with 4 columns: New, Processing, Shipped, Completed
- Orders fetched and distributed into columns by status
- Drag between columns fires `PATCH /api/admin/orders/:id/status`
- Each card shows: buyer name, items (this store only), order total, guest/member badge
- DS components created: `Avatar`, `Divider`

### Phase 5 — Order Detail & Contacts
Add the order detail view and the buyer contacts list.

**Deliverables:**
- Click an order card → opens drawer or modal with full buyer info + itemized order
- `/admin/contacts` page lists all buyers who ordered from this store
- Buyers grouped by their latest order status
- DS components created: `Grid`

---

## Open Questions

| Question | Owner | Due |
|----------|-------|-----|
| When a shop owner moves an order status, should the buyer get an email? (Resend) | — | Phase 4 |
| Should the contacts list be sortable or searchable? | — | Before Phase 3 build |
| Multi-store status conflict — do we need to handle it in Phase 3 or punt? | — | Before Phase 3 build |
