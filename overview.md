# Bazaar — Product Requirements Document

## Overview

A two-sided marketplace app. Buyers browse and purchase products.
Shop owners manage orders via a Kanban board and track buyers via a contacts list.

## Tech Stack

- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: Neon (Postgres)
- Auth: Clerk
- Styling: Tailwind CSS
- Deployment: Railway
- Monorepo: /client (React) + /server (Express) in one repo

## Design System

Build components as needed, do not create them all upfront.
Lives at /client/src/ds/components
Start with: Flex, Text, Button, Card — create others as screens require them.
Use explicit Tailwind class maps (not dynamic string interpolation) to avoid purge issues.
Export everything from /client/src/ds/index.js

## Database Schema

### buyers

- id
- clerk_user_id ← NULL if guest, populated if logged in (unique when not null)
- name ← always required
- email ← always required, used as fallback key for guests (unique)
- address ← always required
- created_at

### products

- id
- name
- description
- price
- image_url
- category
- stock
- created_at

### orders

- id
- buyer_id ← FK → buyers.id
- status ← enum: 'new' | 'processing' | 'shipped' | 'completed'
- total
- created_at

### order_items

- id
- order_id ← FK → orders.id
- product_id ← FK → products.id
- quantity
- price_at_purchase

## Auth — Clerk

Clerk handles all account management (passwords, sessions, email verification).
Your DB never stores passwords.

### Roles (managed in Clerk dashboard)

- buyer → default role for all signups
- admin → manually assigned to shop owner in Clerk dashboard

### Route Protection

- Public: /, /product/:id — no login needed
- Checkout: login optional (guest checkout supported)
- /admin/\*: requires Clerk login with admin role
- /api/admin/\*: Express middleware checks Clerk JWT for admin role

## Guest Checkout

- Login is optional at checkout
- Guest buyers provide name, email, address only
- buyers.clerk_user_id is nullable
- Buyer lookup logic at order creation:
  - Authenticated → find or create buyer by clerk_user_id
  - Guest → find or create buyer by email
- Both guest and member orders appear on admin Kanban board
- Contacts list shows a Guest or Member badge per buyer

## User Journeys

### Buyer

1. Land on homepage → see all product listings (no login required)
2. Click product → see product detail page
3. Add to cart + adjust quantity (no login required, cart lives in Zustand)
4. Go to cart → proceed to checkout
5. Checkout page → choose to login/signup via Clerk OR continue as guest
6. Fill in name, email, address
7. Submit order → POST /api/orders creates order, order_items, upserts buyer
8. See order confirmation page with order summary

### Shop Owner

1. Navigate to /admin → must be logged in with admin role (Clerk check)
2. See Kanban board with columns: New | Processing | Shipped | Completed
3. Each card shows: buyer name, product(s), order total, guest or member badge
4. Drag cards between columns → PATCH /api/admin/orders/:id/status
5. Click a card → see full order detail + buyer contact info
6. /admin/contacts → all buyers listed, grouped by their latest order status

## Build Phases

### Phase 1 — Listings (start here)

- Scaffold monorepo: /client (Vite + React) + /server (Express)
- Connect Neon DB, run schema migrations
- Seed a few products manually
- GET /api/products → return all products
- Homepage / → product grid
- Product detail /product/:id
- DS components to create: Flex, Card, Text, Button

### Phase 2 — Cart + Checkout + Orders

- Cart state in Zustand (client side, no DB)
- /cart page with quantity controls and remove item
- /checkout page:
  - Optional Clerk login/signup
  - Guest form: name, email, address
  - Order summary sidebar
- POST /api/orders → upsert buyer, create order + order_items
- /confirmation/:orderId → order success page
- DS components to create: Input, Stack, Badge

### Phase 3 — Admin Kanban

- /admin protected by Clerk admin role middleware
- GET /api/admin/orders → all orders with buyer + items joined
- PATCH /api/admin/orders/:id/status → update status
- Kanban board with @dnd-kit drag and drop
- Order cards with buyer name, items, total, guest/member badge
- Click card → order detail drawer or modal
- DS components to create: Avatar, Divider

### Phase 4 — Contacts + Stretch

- GET /api/admin/buyers → all buyers with latest order status
- /admin/contacts → buyers grouped by order status
- Email notification via Resend when shop owner moves order status
- DS components to create: Grid

## Key Rules

- Build DS components only when a screen needs them
- No auth required to browse or add to cart
- Guest checkout supported — clerk_user_id is nullable on buyers
- Mock payment at checkout for now (no Stripe yet)
- Use explicit Tailwind class maps in DS components, no dynamic string interpolation
- Railway for deployment, Neon for Postgres, Clerk for auth

## Stretch / Future Sessions

- Stripe payment integration at checkout
- Order search and filter on admin Kanban
- Inventory management (decrement stock on purchase)
- Buyer account page to view past orders
- Shop owner can add/edit/delete products from admin

## How to Work With Claude Code

1. Paste this PRD and say: "Read this PRD. Do not build anything yet. Ask clarifying questions first."
2. Then say: "Scaffold the monorepo structure and install all dependencies only."
3. Then say: "Now build Phase 1 — product listings API route and homepage."
4. Continue phase by phase. Do not ask Claude Code to build everything at once.
