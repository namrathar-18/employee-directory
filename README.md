# Cadre

🌐 Live Demo: https://cisogenie-client.onrender.com/

Cadre is a full-stack people directory — browse the team, search and filter, and
add / edit / remove employees. React + TypeScript on the front end, an Express +
MongoDB API on the back.

## Features

- Directory table with server-side **search**, **department / status filters**, **column sorting** and **pagination**
- Individual **employee profile** pages with contact and employment details
- **Add, edit and delete** employees, with validation on both the client and the server
- **Dashboard** with headcount stats and a department breakdown
- **Command palette** (Ctrl/⌘ + K) for instant search and quick navigation
- **Sign-in screen** with a lightweight demo auth flow
- **Light / dark theme** that remembers your choice
- **Responsive** layout for desktop, tablet and mobile
- Export the current view to **CSV**

## Tech

**Frontend:** React 18, TypeScript, Vite, React Router, TanStack Query, React Hook Form + Zod
**Backend:** Node, Express, TypeScript, MongoDB (Mongoose), Zod
**Tests:** Vitest + Testing Library

There's no UI kit — the interface is hand-built with CSS Modules and CSS variables, which
keeps the theming straightforward.

## Getting started

### Prerequisites

- Node 18 or newer, and npm
- A MongoDB database. A local install works out of the box; a free MongoDB Atlas cluster is fine too.

### 1. Install

```bash
npm install
```

It's an npm workspaces monorepo, so this installs both `client` and `server` in one go.

### 2. Configure the server

```bash
cp server/.env.example server/.env
```

(on Windows: `copy server\.env.example server\.env`)

Open `server/.env` and set `MONGODB_URI`. The example already points at a local Mongo
(`mongodb://127.0.0.1:27017/employee_directory`), so if you're running Mongo locally you
don't need to change anything.

### 3. Seed some sample data

```bash
npm run seed
```

Drops ~50 example employees in so the app isn't empty on first run.

### 4. Run it

```bash
npm run dev
```

- Web → http://localhost:5173
- API → http://localhost:4000

The Vite dev server proxies `/api` to the backend, so you only need to open the web URL.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the API and web app together |
| `npm run seed` | Resets and re-seeds the database |
| `npm run build` | Builds both packages for production |
| `npm test` | Runs the unit tests |
| `npm run typecheck` | Type-checks both packages |

## API

Base URL: `/api`

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/employees` | List — supports `q`, `department`, `status`, `sort`, `page`, `limit` |
| GET | `/employees/:id` | Fetch one employee |
| POST | `/employees` | Create |
| PATCH | `/employees/:id` | Update |
| DELETE | `/employees/:id` | Delete |
| GET | `/stats` | Dashboard numbers |
| GET | `/meta` | Departments / statuses / employment types |

## Project layout

```
client/   React app (Vite)
server/   Express API
```

## Deploying to Vercel

The repo is wired to deploy the whole thing — web app and API — to Vercel as a single project:

1. Import the repo on Vercel. The build settings come from `vercel.json`, so leave them as detected.
2. Add an environment variable **`MONGODB_URI`** with your connection string.
3. In MongoDB Atlas, allow access from anywhere (`0.0.0.0/0`) under Network Access so Vercel can reach the database.
4. Deploy.

The API runs as a serverless function under `/api`, and the frontend calls it on the same origin,
so there's nothing else to configure.

## Notes & assumptions

- Search matches name, email and job title — case-insensitive, partial match.
- Email is unique; the API responds with a 409 if you try to reuse one.
- Pagination, sorting and filtering happen on the server so it holds up past a few records.
- No login / auth — it felt out of scope for a directory and the brief didn't call for it. The
  "Administrator" shown in the sidebar is a placeholder for the signed-in user.
- Secrets live in `server/.env`, which is gitignored. `server/.env.example` lists what's needed.
- The sample data is fictional.
