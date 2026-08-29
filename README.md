# expense-gql

A full-stack expense tracker built with a GraphQL API and a React client, organized as a pnpm workspace.

## Structure

```
.
├── apps/
│   ├── server/        # Express + Apollo Server 4 + Mongoose + Passport (TypeScript)
│   │   └── src/
│   │       ├── db/           # Mongo connection
│   │       ├── models/       # Mongoose models (User, Transaction)
│   │       ├── passport/     # Passport local strategy
│   │       ├── resolvers/    # GraphQL resolvers
│   │       ├── typeDefs/     # GraphQL SDL types
│   │       └── index.ts      # Server entry
│   └── client/       # Vite 7 + React 19 + Apollo Client 4 + Tailwind CSS 4
│       └── src/
│           ├── components/
│           ├── graphql/
│           ├── pages/
│           └── ...
├── pnpm-workspace.yaml
└── package.json
```

## Prerequisites

- Node.js ≥ 20.19 (for Vite 7)
- pnpm ≥ 9
- MongoDB (local or Atlas)

## Getting started

```bash
# 1. Install dependencies (from the repo root)
pnpm install

# 2. Configure the server environment
cp apps/server/.env.example apps/server/.env
# then fill in MONGO_URI and SESSION_SECRET

# 3. Start the whole stack (server + client together)
pnpm dev

# Or run each independently
pnpm dev:server   # GraphQL API at http://localhost:4000/graphql
pnpm dev:client   # Vite dev server at http://localhost:5173
```

The Vite dev server proxies `/graphql` to `http://localhost:4000`, so the client always talks to `/graphql` (same in dev and production).

## Environment variables

Server (`apps/server/.env`):

| Variable       | Description                                              |
| -------------- | -------------------------------------------------------- |
| `MONGO_URI`    | MongoDB connection string                                |
| `SESSION_SECRET` | Secret used to sign the session ID cookie              |
| `CLIENT_URL`   | Allowed CORS origin, e.g. `http://localhost:5173`        |
| `NODE_ENV`     | `development` or `production`                            |
| `PORT`         | Server port (defaults to `4000`)                         |

The client needs no environment variables.

## Scripts (run from the repo root)

| Command          | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `pnpm dev`       | Run server and client in parallel (watch mode)           |
| `pnpm dev:server`| Run the API with `tsx watch`                             |
| `pnpm dev:client`| Run the Vite dev server                                  |
| `pnpm build`     | Type-check and build all workspaces                      |
| `pnpm start`     | Run the compiled server (`node dist/index.js`)           |
| `pnpm lint`      | ESLint across all workspaces                             |
| `pnpm format`    | Prettier across all workspaces                           |
| `pnpm typecheck` | `tsc --noEmit` across all workspaces                     |

## Production

```bash
pnpm build
NODE_ENV=production pnpm start
```

The server serves the built client from `apps/client/dist` on non-`/graphql` routes.

## Notes

- The server uses ESM (`"type": "module"`). Source lives in `src/`, and `tsc` emits to `dist/`.
- Client dependencies are pinned to current majors: Vite 7, React 19, Apollo Client 4, Tailwind CSS 4, react-router 7.
- The custom `bg-grid`, `bg-grid-small`, and `bg-dot` utilities (previously Tailwind v3 plugins) are recreated with Tailwind v4 `@utility` directives in `apps/client/src/index.css`.