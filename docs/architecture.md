# Architecture

## Overview

Bazaar is a monorepo with two packages — a React client and an Express server — talking to a Neon Postgres database.

```
Browser → Vite dev server (5173)
              ↓ /api proxy
         Express server (3001)
              ↓
         Neon (Postgres)
```

In production the client is built to static files and served separately; the Express server runs standalone.

---

## Folder structure

```
/bazaar
  /client                   # React + Vite frontend
    /.ladle                 # Ladle component browser config + global CSS provider
    /src
      /components           # Shared domain components
        ProductCard.tsx
      /ds                   # Design system — generic UI primitives only
        /components         # Button, Card, Flex, Text
      /pages
        /Home               # Homepage — product grid
        /ProductDetail      # Single product view
        /Store              # Store profile + product grid
      App.tsx               # Route definitions
      main.tsx              # React entry point
      types.ts              # Shared TypeScript types
      index.css             # Tailwind v4 import + theme tokens
      test-setup.ts         # @testing-library/jest-dom setup for Vitest

  /server                   # Express + TypeScript API
    /db
      index.ts              # Drizzle client + pg pool
      schema.ts             # Table definitions
      seed.ts               # Seed script
    /routes
      products.ts           # GET /api/products, GET /api/products/:id
      stores.ts             # GET /api/stores/:id
    app.ts                  # Express app (no listen — allows test imports)
    index.ts                # Server entry point
    drizzle.config.ts       # Drizzle Kit config (migrations, studio)
    swagger.ts              # swagger-jsdoc config, exports swaggerSpec
    swagger.schemas.ts      # Reusable OpenAPI component schemas

  /docs                     # Project documentation
    architecture.md
    features.md
```

---

## Tech stack

### Client

| Tool                         | Why                                                               |
| ---------------------------- | ----------------------------------------------------------------- |
| **React 19**                 | Component model, hooks                                            |
| **Vite 6**                   | Fast dev server, ESM-native bundler                               |
| **TypeScript**               | Type safety across the codebase                                   |
| **React Router v7**          | Client-side routing                                               |
| **Tailwind CSS v4**          | Utility-first styling with `@theme` tokens for semantic colors    |
| **Ladle**                    | Vite-native component browser — no Webpack, no Storybook overhead |
| **Vitest + Testing Library** | Unit and component tests co-located with source files             |
| **Zustand**                  | Lightweight client state (used in Phase 2+)                       |

Tailwind is configured via PostCSS (`postcss.config.js`) rather than the Vite plugin — this was required for Ladle compatibility.

The `@` path alias maps to `src/`, so all imports use `@/ds`, `@/types`, etc. instead of relative paths.

### Server

| Tool                      | Why                                                          |
| ------------------------- | ------------------------------------------------------------ |
| **Express 5**             | Minimal, familiar HTTP server                                |
| **TypeScript (CommonJS)** | Type safety; CommonJS used for Node/tooling compatibility    |
| **Drizzle ORM**           | Type-safe queries, schema-as-code, lightweight vs Prisma     |
| **Neon**                  | Serverless Postgres — no connection management overhead      |
| **Clerk**                 | Auth (used in Phase 2+)                                      |
| **tsx**                   | Runs TypeScript directly in development without a build step |
| **swagger-jsdoc**         | Generates OpenAPI spec from `@openapi` JSDoc blocks in route files |
| **swagger-ui-express**    | Serves live API docs UI at `/api/docs` (dev only)            |

The Express app is exported from `app.ts` separately from the `listen()` call in `index.ts`. This lets tests import the app without binding a port.

---

## Data flow

### Fetching products (homepage)

```
Home.tsx
  → fetch("/api/products")
  → Express GET /api/products
  → Drizzle: SELECT products JOIN stores
  → returns TProductWithStore[]
```

### Fetching a single product

```
ProductDetail.tsx
  → fetch("/api/products/:id")
  → Express GET /api/products/:id
  → Drizzle: SELECT products JOIN stores WHERE id = :id
  → returns TProductWithStore | 404
```

### Fetching a store

```
Store.tsx
  → fetch("/api/stores/:id")
  → Express GET /api/stores/:id
  → Drizzle: SELECT store WHERE id = :id
             SELECT products WHERE store_id = :id
  → returns TStore { ...store, products: TProduct[] } | 404
```

---

## Database schema

```
stores
  id             uuid PK
  clerk_user_id  text UNIQUE
  name           text
  bio            text?
  location       text?
  created_at     timestamp

products
  id             uuid PK
  store_id       uuid FK → stores.id
  name           text
  description    text?
  price          numeric(10,2)
  image_url      text?
  category       text?
  stock          integer
  created_at     timestamp

buyers
  id             uuid PK
  clerk_user_id  text?
  name           text
  email          text UNIQUE
  address        text
  created_at     timestamp

orders
  id             uuid PK
  buyer_id       uuid FK → buyers.id
  status         enum(new, processing, shipped, completed)
  total          numeric(10,2)
  created_at     timestamp

order_items
  id                  uuid PK
  order_id            uuid FK → orders.id
  product_id          uuid FK → products.id
  quantity            integer
  price_at_purchase   numeric(10,2)
```

---

## Design system conventions

The DS (`src/ds/`) contains only generic, domain-agnostic UI primitives. Components that know about the product domain (e.g. `ProductCard`) live in `src/components/` instead.

- All DS components use `const` arrow functions with `export default` at the bottom
- Tailwind class maps are explicit — no dynamic string interpolation
- Semantic color tokens are defined in `index.css` via Tailwind v4's `@theme` block

---

## Key decisions & tradeoffs

### Tailwind via PostCSS instead of the Vite plugin

Tailwind v4 ships a `@tailwindcss/vite` plugin, but it has a known regression (v4.0.8+) that breaks style injection in Ladle. The fix was to drop the Vite plugin entirely and use `@tailwindcss/postcss` with a `postcss.config.js` instead. Both the main Vite app and Ladle pick up PostCSS config automatically.

**Tradeoff:** Slightly less integrated with Vite's pipeline, but the behaviour is identical in practice and unblocks Ladle.

---

### `app.ts` separated from `index.ts` on the server

The Express app is exported from `app.ts` without calling `listen()`. The `index.ts` entry point imports `app` and starts the server. This means tests can import the app directly via Supertest without binding a real port — no port conflicts, no async teardown needed.

**Tradeoff:** One extra file, but the alternative (mocking `listen` or using dynamic ports in every test file) is much messier.

---

### Drizzle ORM over Prisma

Drizzle keeps the schema as TypeScript — no `.prisma` file, no separate codegen step. Queries are type-safe and composable without a heavy runtime. It also integrates cleanly with Neon's `pg` driver.

**Tradeoff:** Drizzle's API is lower-level than Prisma's. More explicit, but also more verbose for complex relations. Fine for this project's query patterns.

---

### Ladle over Storybook

Ladle is Vite-native and uses the same `*.stories.tsx` format as Storybook, so it's a drop-in for the component browser use case. Storybook requires Webpack (or a Vite adapter with known compatibility issues) and significantly slower cold starts.

**Tradeoff:** Ladle has a smaller ecosystem and fewer addons than Storybook. Acceptable since we only need the component browser, not the full addon suite.

---

### `src/components/` vs `src/ds/`

The DS is intentionally restricted to generic, domain-agnostic primitives (`Button`, `Card`, `Flex`, `Text`). Components that encode product domain knowledge — like `ProductCard` — live in `src/components/` instead. This keeps the DS reusable across any future domain without leaking business logic into it.

**Tradeoff:** Two places to look for components. The rule is simple: if it imports a domain type, it doesn't belong in the DS.

---

### Server uses CommonJS, client uses ESM

The server's `package.json` sets `"type": "commonjs"` while the client uses `"type": "module"`. Node tooling (especially esbuild-based tools and some Drizzle kit internals) has historically had friction with ESM on the server side. CommonJS avoids those issues without any real downside since the server code isn't bundled for the browser.

**Tradeoff:** `require()` syntax on the server vs `import` on the client. In practice TypeScript abstracts this — both packages write `import` statements and the compiler outputs the right format.
