# Bazaar

A multi-store marketplace where independent sellers list products and buyers browse and purchase them.

## Packages

| Package | Description |
|---------|-------------|
| `client/` | React + Vite frontend |
| `server/` | Express + TypeScript API |

## Getting started

### Prerequisites

- Node.js 22+
- A [Neon](https://neon.tech) Postgres database

### Environment variables

**`server/.env`**
```
DATABASE_URL=your_neon_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
```

**`client/.env`**
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Install dependencies

```bash
cd server && npm install
cd client && npm install
```

### Set up the database

```bash
cd server
npm run db:migrate   # run migrations
npm run seed         # seed 2 stores and 6 products
```

### Run locally

```bash
# Terminal 1 — API server (port 3001)
cd server && npm run dev

# Terminal 2 — Vite dev server (port 5173)
cd client && npm run dev
```

The client proxies `/api` requests to `localhost:3001`, so no CORS config needed during development.

### Other commands

```bash
# Component browser (Ladle)
cd client && npm run ladle

# Run tests
cd client && npm test
cd server && npm test

# Database GUI
cd server && npm run db:studio
```

## Docs

- [Architecture](docs/architecture.md)
- [Features](docs/features.md)
- [Design System](client/src/ds/README.md)
