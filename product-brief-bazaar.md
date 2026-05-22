# Product Brief: Bazaar

**Status:** Draft  
**Date:** 2026-05-22  
**Domain:** Marketplace

---

## Target Users

### The Buyer
A shopper — new or returning — who discovers products on the marketplace homepage without knowing which store they come from. They browse, find something they like, and want to buy it without friction. Today they might be shopping across multiple platforms or finding sellers via social media with no unified place to browse.

### The Shop Owner
A seller running their own store on the platform. Their main frustration is keeping track of incoming orders and knowing what stage each one is at. Today they're probably managing this in a spreadsheet, their inbox, or not at all. They want one place to see all their orders and move them through to completion.

---

## User Stories

### The Buyer
- As a buyer, I want to browse all products on the homepage so that I can discover items without needing to know which store sells them.
- As a buyer, I want to click a product and see its detail page so that I can decide if I want to buy it.
- As a buyer, I want to visit a store's page from a product so that I can see what else that seller offers and learn a bit about them.
- As a buyer, I want to add products from multiple stores to one cart so that I can check out in a single transaction.
- As a buyer, I want to check out as a guest or with an account so that I'm not forced to sign up to make a purchase.
- As a buyer, I want to see an order confirmation after purchase so that I know my order went through.

### The Shop Owner
- As a shop owner, I want to create an account and set up my store so that I can start listing products.
- As a shop owner, I want to add products to my store so that buyers can find and purchase them.
- As a shop owner, I want to see all my incoming orders on a board so that I know what needs my attention.
- As a shop owner, I want to move an order from New → Processing → Shipped → Completed so that I can track where each order is at a glance.
- As a shop owner, I want to see the buyer name, items ordered, and total on each order card so that I have enough context to act without clicking in.

---

## Requirements

- Buyers can browse all products from all stores on a unified homepage — no store context required to start browsing.
- Clicking a product goes to a product detail page, which links to the seller's store page.
- A store page shows the seller's name, bio, location, and all their products.
- Buyers can add products from multiple stores into one cart.
- A single combined order/invoice is created at checkout, even if items span multiple stores.
- Guest checkout supported — buyer provides name, email, address only, no account required.
- Shop owners have accounts and can create and manage their own store.
- Shop owners can add products to their store (name, description, price, image, category, stock).
- Shop owners see a Kanban board with columns: New, Processing, Shipped, Completed.
- Each order card shows: buyer name, item(s) ordered, order total.
- Shop owners can drag or move an order card between status columns.
- Orders from all buyers (guest and member) appear on the shop owner's board.

---

## Soft Requirements

- Buyers can create an account to have a more persistent experience (saved history, easier re-order).
- Store page feels like a mini storefront — not just a filtered product grid.
- Order card click opens a detail view with full buyer contact info and itemized order.
- Contacts list for shop owners showing all buyers grouped by latest order status.
- Guest vs. member badge visible on order cards and contacts list.

---

## Iterations

### Phase 1 — MVP
Get a buyer from homepage to checkout, and give shop owners a working order board. This proves the core loop: discovery → purchase → fulfillment tracking.

**Includes:**
- Unified product homepage (all stores, no login needed)
- Product detail page + store page (name, bio, location, products)
- Cart (multi-store, client-side)
- Checkout — guest or logged-in, single combined order
- Order confirmation page
- Shop owner account + store creation
- Product management (add/edit products)
- Kanban board — all orders, move between statuses

### Phase 2
Make the shop owner experience richer and give buyers a reason to create accounts.

**Includes:**
- Order detail view (full buyer info + itemized receipt)
- Buyer contacts list grouped by order status
- Buyer account with order history

### Phase 3 and beyond
Expand into seller tools and monetization. Email notifications when order status changes, inventory management, Stripe payments, order search and filtering, and eventually shop analytics.
