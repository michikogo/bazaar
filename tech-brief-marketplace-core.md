# Technical Brief: Marketplace Core

**Status:** Draft
**Date:** 2026-05-22
**Product Brief:** product-brief-bazaar.md
**Stack:** React (Vite) + Node.js/Express + Neon (Postgres) + Clerk + Tailwind CSS + Railway

---

## Overview

Phase 1 foundation. Sets up the monorepo, defines the full data model including the missing `stores` table, and delivers the product listings API and public-facing buyer pages (homepage + product detail + store page). Everything in Phase 2 and 3 builds on top of this.

## System Architecture

```
Browser (React/Vite)
  → GET /api/products          → Express → Neon (Postgres)
  → GET /api/products/:id      → Express → Neon
  → GET /api/stores/:id        → Express → Neon
```

| Component | Type | Role |
|-----------|------|------|
| /client | React SPA (Vite) | Buyer-facing UI |
| /server | Express API | Business logic + DB access |
| Neon | Postgres (serverless) | Primary database |
| Clerk | Auth SaaS | Account management, session tokens |
| Railway | Hosting | Deploy both client and server |

### Monorepo Structure

```
/bazaar
  /client          ← Vite + React
    /src
      /ds
        /components  ← design system components
        index.js     ← barrel export
      /pages
      /components
  /server          ← Express
    /routes
    /db
    /middleware
  package.json     ← root (optional shared scripts)
```

---

## Data Model

```
stores {
  id:             uuid          // PK
  clerk_user_id:  string        // unique — one store per Clerk user
  name:           string
  bio:            text
  location:       string
  created_at:     timestamp
}

products {
  id:             uuid
  store_id:       uuid          // FK → stores.id
  name:           string
  description:    text
  price:          numeric(10,2)
  image_url:      string
  category:       string
  stock:          integer
  created_at:     timestamp
}

buyers {
  id:             uuid
  clerk_user_id:  string        // nullable — NULL for guests; unique when not null
  name:           string
  email:          string        // unique — used as fallback key for guests
  address:        text
  created_at:     timestamp
}

orders {
  id:             uuid
  buyer_id:       uuid          // FK → buyers.id
  status:         enum          // 'new' | 'processing' | 'shipped' | 'completed'
  total:          numeric(10,2)
  created_at:     timestamp
}

order_items {
  id:             uuid
  order_id:       uuid          // FK → orders.id
  product_id:     uuid          // FK → products.id
  quantity:       integer
  price_at_purchase: numeric(10,2)
}
```

Relationships:
- `stores` → `products`: one-to-many
- `buyers` → `orders`: one-to-many
- `orders` → `order_items`: one-to-many
- `order_items` → `products`: many-to-one (store context recovered via `products.store_id`)

Note: no `store_id` on `order_items` — store is recovered by joining `order_items → products → stores`. This keeps the schema clean and avoids denormalization.

---

## API Design

```
GET /api/products
Auth: none

Response: [
  {
    "id": uuid,
    "store_id": uuid,
    "name": string,
    "description": string,
    "price": number,
    "image_url": string,
    "category": string,
    "stock": integer
  }
]

Errors:
- 500: DB failure
```

```
GET /api/products/:id
Auth: none

Response: {
  "id": uuid,
  "store_id": uuid,
  "store_name": string,    // joined from stores
  "name": string,
  "description": string,
  "price": number,
  "image_url": string,
  "category": string,
  "stock": integer
}

Errors:
- 404: product not found
- 500: DB failure
```

```
GET /api/stores/:id
Auth: none

Response: {
  "id": uuid,
  "name": string,
  "bio": string,
  "location": string,
  "products": [ ...product objects ]
}

Errors:
- 404: store not found
- 500: DB failure
```

---

## Security

- **Auth:** Clerk handles all account management. No passwords in DB.
- **Authorization:** All Phase 1 routes are public — no auth required to browse products or stores.
- **Sensitive data:** No PII exposed on product/store endpoints.
- **Compliance:** Nothing special at this stage.

---

## Performance & Scalability

- **Expected load:** Low — early stage, not optimizing for scale yet.
- **Latency target:** Not set — just keep queries simple and indexed.
- **Caching:** Not needed yet.
- **Bottleneck:** `GET /api/products` doing a full table scan — add pagination or limit if product count grows.

---

## Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| Product with `stock: 0` | Still returned in listings — UI can show "Out of stock" label |
| Store has no products | `GET /api/stores/:id` returns store with empty products array |
| Invalid UUID in route param | 400 or 404 — Express should validate before hitting DB |

---

## Key Decisions & Tradeoffs

### One store per Clerk user
- **Chosen:** `stores.clerk_user_id` is unique — one account, one store.
- **Alternatives:** Junction table for multi-store ownership.
- **Rationale:** Keeps auth simple. Shop owner identity = Clerk user = one store.
- **Tradeoff:** A seller can never run two separate stores under one account.
- **Reversible?** Partially — would require a new junction table and auth refactor.

### Store context via join, not denormalized store_id on order_items
- **Chosen:** Recover store from `order_items → products → stores`.
- **Alternatives:** Add `store_id` directly to `order_items`.
- **Rationale:** Avoids redundancy — product already knows its store.
- **Tradeoff:** Slightly more complex join queries on admin endpoints.
- **Reversible?** Yes — easy to add the column later if query performance demands it.

---

## Build Phases

### Phase 1 — Monorepo Scaffold
Set up the project structure, install all dependencies, configure environment variables, and establish the DB connection.

**Deliverables:**
- `/client` (Vite + React + Tailwind) and `/server` (Express) folders created
- All dependencies installed (`pg`, `clerk`, `zustand`, `@dnd-kit/core`, etc.)
- `.env` files configured for Neon DB connection string and Clerk keys
- Express server running and reachable locally

### Phase 2 — Database Schema & Seed
Run migrations to create all tables and seed a few products to test against.

**Deliverables:**
- All tables created: `stores`, `products`, `buyers`, `orders`, `order_items`
- At least 2 stores and 6 products seeded manually
- DB connection verified via a test query

### Phase 3 — API Routes
Build and test the three public endpoints.

**Deliverables:**
- `GET /api/products` — returns all products
- `GET /api/products/:id` — returns single product with store name joined
- `GET /api/stores/:id` — returns store with their products

### Phase 4 — Homepage
Buyer-facing product grid pulling live data from the API.

**Deliverables:**
- `/` route renders all products in a grid
- Each product card shows: image, name, price, store name
- DS components created: `Flex`, `Card`, `Text`, `Button`

### Phase 5 — Product Detail Page
Single product view with full details and a link to the store.

**Deliverables:**
- `/product/:id` route renders product detail
- Includes store name as a clickable link to `/store/:id`
- Add to cart button (wired up in Phase 2 of the product brief)

### Phase 6 — Store Page
Seller profile page showing their info and all their products.

**Deliverables:**
- `/store/:id` route renders store name, bio, location
- Products grid filtered to that store only

---

## Open Questions

| Question | Owner | Due |
|----------|-------|-----|
| Do we seed products manually or build an admin product creation UI in Phase 1? | — | Before Phase 1 build |
| Pagination on `GET /api/products` — how many products are expected at launch? | — | Before Phase 1 build |
