# Technical Brief: Cart, Checkout & Orders

**Status:** Draft
**Date:** 2026-05-22
**Product Brief:** product-brief-bazaar.md
**Stack:** React (Vite) + Zustand + Node.js/Express + Neon (Postgres) + Clerk

---

## Overview

Phase 2. Covers the full buyer purchase flow: cart state on the client, checkout with optional Clerk login or guest form, order creation on the server, and the confirmation page. The trickiest part is the combined order model — one order row regardless of how many stores the buyer's cart spans.

## System Architecture

```
Browser
  Zustand (cart state, in-memory)
    → /cart page
    → /checkout page
      → Clerk (optional login)
      → POST /api/orders → Express → Neon
    → /confirmation/:orderId
      → GET /api/orders/:id → Express → Neon
```

| Component | Type | Role |
|-----------|------|------|
| Zustand store | Client state | Cart items, quantities — no persistence |
| Clerk | Auth SaaS | Optional login at checkout |
| POST /api/orders | Express route | Upserts buyer, creates order + order_items |
| GET /api/orders/:id | Express route | Returns order for confirmation page |

---

## Data Model

No new tables. Relies on the schema from `tech-brief-marketplace-core.md`.

Key flow at order creation:

```
Authenticated buyer:
  → find buyer by clerk_user_id
  → if not found: create buyer with clerk_user_id + form data

Guest buyer:
  → find buyer by email
  → if not found: create buyer with email + form data (clerk_user_id = NULL)
```

Combined order — all cart items regardless of store go into one `orders` row:

```
orders {
  id, buyer_id, status: 'new', total, created_at
}

order_items {
  order_id, product_id, quantity, price_at_purchase
}
```

`price_at_purchase` is snapshotted at order creation time — not read from `products.price` after the fact.

---

## API Design

```
POST /api/orders
Auth: optional (Clerk JWT if logged in, none if guest)

Request: {
  "buyer": {
    "name": string,
    "email": string,
    "address": string
  },
  "items": [
    {
      "product_id": uuid,
      "quantity": integer,
      "price_at_purchase": number
    }
  ]
}

Response: {
  "order_id": uuid
}

Errors:
- 400: missing buyer fields, empty items array
- 404: product_id not found
- 500: DB failure
```

```
GET /api/orders/:id
Auth: none (confirmation page is public — order ID is the access token)

Response: {
  "id": uuid,
  "status": string,
  "total": number,
  "created_at": timestamp,
  "buyer": {
    "name": string,
    "email": string,
    "address": string
  },
  "items": [
    {
      "product_id": uuid,
      "product_name": string,
      "store_name": string,
      "quantity": integer,
      "price_at_purchase": number
    }
  ]
}

Errors:
- 404: order not found
- 500: DB failure
```

---

## Security

- **Auth:** Clerk JWT checked on `POST /api/orders` if present. If absent, treated as guest — no rejection.
- **Authorization:** Buyers can only view their own order via `GET /api/orders/:id`. Order ID is a UUID — not guessable, acts as the access token for the confirmation page.
- **Sensitive data:** Buyer email and address stored in DB. Not returned in product/store endpoints.
- **Compliance:** Nothing special at this stage.

---

## Performance & Scalability

- **Expected load:** Low at launch.
- **Latency target:** `POST /api/orders` should complete in one transaction — upsert buyer + insert order + insert order_items atomically.
- **Caching:** Not needed.
- **Bottleneck:** Order creation must be wrapped in a DB transaction. If any insert fails, the whole order rolls back.

---

## Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| Guest checks out with email already in buyers table | Find existing buyer by email, attach order to them — do not create duplicate |
| Authenticated user checks out — no buyer record yet | Create buyer row with clerk_user_id + form data |
| Authenticated user who previously checked out as guest | Two separate buyer rows (one with clerk_user_id, one without). Not merged in Phase 2 — flagged as open question |
| Cart item product no longer exists | 404 on POST /api/orders — surface error to user before submitting |
| Empty cart at checkout | 400 — items array cannot be empty |
| Order creation DB transaction fails partway | Full rollback — buyer upsert included. Return 500. |

---

## Key Decisions & Tradeoffs

### Cart lives in Zustand (client-only, no DB)
- **Chosen:** Zustand in-memory store, reset on page refresh.
- **Alternatives:** Server-side cart persisted in DB.
- **Rationale:** No login required to add to cart. A DB cart requires either a session ID or auth — adds complexity before checkout.
- **Tradeoff:** Cart is lost on refresh. Buyers who browse and come back later start over.
- **Reversible?** Yes — can persist cart to DB later without changing the checkout flow.

### Combined order across multiple stores
- **Chosen:** One `orders` row regardless of how many stores items come from.
- **Alternatives:** One order per store (split at checkout).
- **Rationale:** Simpler buyer experience — one invoice, one confirmation page. Agreed in product brief.
- **Tradeoff:** Each shop owner sees the full order total, not just their portion. Order status is shared — if Store A ships and moves to "Shipped", that affects Store B's view too.
- **Reversible?** Partially — would require splitting orders table and refactoring admin views.

### price_at_purchase snapshotted at order time
- **Chosen:** Store price in `order_items.price_at_purchase` at creation.
- **Alternatives:** Read from `products.price` at query time.
- **Rationale:** Product prices can change. Order history must reflect what the buyer actually paid.
- **Tradeoff:** Slight data duplication, but intentional.
- **Reversible?** N/A — this is the correct approach.

---

## Build Phases

### Phase 1 — Zustand Cart
Set up client-side cart state. No backend needed yet.

**Deliverables:**
- Zustand store with add, remove, update quantity actions
- `/cart` page renders cart items with quantity controls and remove button
- Cart total calculated client-side
- "Proceed to checkout" button navigates to `/checkout`

### Phase 2 — Checkout Page
Build the checkout UI with optional Clerk login and guest form.

**Deliverables:**
- `/checkout` page with guest form (name, email, address)
- Optional Clerk login/signup flow — if logged in, pre-fill known fields
- Order summary sidebar showing cart items and total
- Submit button wired to `POST /api/orders`

### Phase 3 — Order Creation API
Build the server endpoint that turns a cart into a persisted order.

**Deliverables:**
- `POST /api/orders` — upserts buyer, creates order + order_items in one DB transaction
- Guest buyer lookup by email, authenticated buyer lookup by clerk_user_id
- Returns `order_id` on success
- Full rollback on any failure

### Phase 4 — Confirmation Page
Show the buyer their completed order after checkout.

**Deliverables:**
- `/confirmation/:orderId` page
- `GET /api/orders/:id` endpoint returns order with buyer info and itemized products
- DS components created: `Input`, `Stack`, `Badge`

---

## Open Questions

| Question | Owner | Due |
|----------|-------|-----|
| Guest who later creates an account — do we merge their buyer records? | — | Phase 2 or 3 |
| Should order status updates notify the buyer by email? (Resend) | — | Phase 3 |
| Do we decrement `products.stock` on order creation? | — | Before Phase 2 build |
