# Features

## Phase 1 — Marketplace Core (shipped)

### Homepage — product browsing

**Route:** `/`

Displays all products from all stores in a responsive grid. Each card shows the product image (or a placeholder), name, store name, and price. Clicking a card navigates to the product detail page.

**API:** `GET /api/products`

---

### Product detail page

**Route:** `/product/:id`

Full product view showing the product image, name, price, description, category, and stock count. The store name is a link to the store page. Includes a back button.

Returns a 404 error state if the product ID does not exist.

**API:** `GET /api/products/:id`

---

### Store page

**Route:** `/store/:id`

Store profile showing the store name, location, bio, and a grid of all products belonging to that store. Clicking a product navigates to the product detail page.

Returns a 404 error state if the store ID does not exist.

**API:** `GET /api/stores/:id`

---

## Phase 2 — Cart, Checkout & Orders (upcoming)

Buyers will be able to add products to a cart, proceed through checkout, and place orders. Store owners will be able to view and manage incoming orders.

See [`tech-brief-cart-checkout-orders.md`](tech-brief-cart-checkout-orders.md) for the full technical spec.

---

## Phase 3 — Admin & Seller Kanban (upcoming)

Store owners will have a kanban-style dashboard to manage order status (new → processing → shipped → completed).

See [`tech-brief-admin-kanban.md`](tech-brief-admin-kanban.md) for the full technical spec.
