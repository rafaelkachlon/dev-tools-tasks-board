# TDP Task Board

A small single-page task board for a team project, built with **React 19 + TypeScript + Vite** and styled with **CSS Modules**.

## Requirements

- Node.js **20.19+** or **22.12+**
- npm 10+
- Google Chrome (recommended, for DevTools)

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>.

No database, backend or environment variables are needed. The REST API is served by the Vite dev server itself.

## Scripts

| Command             | Description                                        |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Start the dev server with the mock API (port 5173) |
| `npm run build`     | Type-check and build for production into `dist/`   |
| `npm run typecheck` | Run the TypeScript compiler only                   |
| `npm run preview`   | Serve the production build (mock API included)     |

## Mock REST API

The API is implemented as a Vite plugin ([mock/mockApiPlugin.ts](mock/mockApiPlugin.ts)) that registers a dev-server middleware. Data lives in memory and resets every time the dev server restarts. Every response is delayed by **400 ms** so loading states are visible.

| Method | Endpoint     | Description                                                            |
| ------ | ------------ | ---------------------------------------------------------------------- |
| GET    | `/api/tasks` | List all tasks                                                         |
| POST   | `/api/tasks` | Create a task. Body: `{ title, assigneeId?, estimateHours?, urgent? }` |
| GET    | `/api/team`  | List team members                                                      |

`POST /api/tasks` responds with `400 { "error": "Field 'title' is required" }` when `title` is missing.

Seed data lives in [mock/seed.ts](mock/seed.ts).

## Project structure

```
├─ mock/                  Mock API (Vite middleware plugin) + seed data
├─ public/                Static assets
└─ src/
   ├─ api/                fetch wrapper and API functions
   ├─ components/         UI components (one folder per component + CSS Module)
   ├─ types/              Shared TypeScript types
   ├─ utils/              Pure helpers (stats, filtering, formatting)
   ├─ App.tsx             Page layout and state
   └─ main.tsx            Entry point
```

## Tips for the session

- Use Chrome and open DevTools with <kbd>F12</kbd> / <kbd>Cmd</kbd>+<kbd>Opt</kbd>+<kbd>I</kbd>.
- Install the [React Developer Tools](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) extension.
- Source maps are enabled, so the original TypeScript files are available under **Sources → localhost:5173 → src**.
- Restart `npm run dev` to reset the data.
