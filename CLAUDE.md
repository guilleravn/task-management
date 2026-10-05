# CLAUDE.md

## Language rule

Everything written into this repository is in **English**: code, identifiers, comments, commit
messages, PR descriptions and documentation. The user may talk to you in Spanish; nothing you
write into the repo stays in Spanish.

## What this is

A Kanban-style task management app (grid board + list view, filters, search, drag and drop).
It is **frontend only**: there is no backend in this repo. All data (tasks, users, profile) comes
from an external, already-existing GraphQL API hosted on Railway, consumed through Apollo Client.

## Stack — current state

Versions are the ranges declared in `package.json`. Only what exists today is listed.

| Area | What | Version |
| --- | --- | --- |
| UI | React + React DOM | `^19.2.8` |
| Memoization | React Compiler (`babel-plugin-react-compiler`, wired in `vite.config.ts` via `reactCompilerPreset()`) | `^1.0.0` |
| Language | TypeScript, `strict`, type-check only (`noEmit`) | `~6.0.2` |
| Build / dev server | Vite (Rolldown-based) + `@vitejs/plugin-react` + `@rolldown/plugin-babel` | `^8.2.0` / `^6.0.4` / `^0.2.3` |
| Data | Apollo Client + `graphql` | `^4.2.9` / `^16.14.2` |
| Routing | React Router (`react-router-dom`, data router via `createBrowserRouter`) | `^7.18.2` |
| Drag and drop | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | `^6.3.1` / `^10.0.0` / `^3.2.2` |
| Notifications | `react-hot-toast` | `^2.6.0` |
| Styling | CSS Modules + CSS custom-property design tokens (`src/styles/tokens.css`) | — |
| Lint | ESLint flat config + `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` | `^10.8.0` / `^8.65.0` / `^7.1.1` / `^0.5.3` |

Not present (do not assume they exist): no test runner, no Prettier config, no GraphQL codegen,
no global state library (Redux/Zustand/Context store), no UI component library, no Tailwind,
no CI config.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR (`http://localhost:5173`) |
| `npm run build` | `tsc -b && vite build` — type-check first, then bundle to `dist/` |
| `npm run lint` | `eslint .` |
| `npm run preview` | Serve the production build locally |

**There is no `test` script and no test runner configured.** Do not invent one; see
[docs/conventions/testing.md](docs/conventions/testing.md).

Before declaring a change done, run `npm run build` and `npm run lint` — they are the only
automated checks this project has.

The app needs a `.env` (gitignored) with `VITE_API_URL` and `VITE_API_TOKEN`; see `.env.example`.

## Non-negotiable process rules

1. **Plan before implementing anything non-trivial.** Use plan mode and get the plan approved
   before writing code. Trivial = typo, copy change, one-line fix with obvious scope.
2. **Commit per slice**, not one big commit at the end. See
   [docs/conventions/git-workflow.md](docs/conventions/git-workflow.md) for what a slice is here.
3. **Never `git push`** unless the user explicitly asks for it in that moment.
4. **Show the full commit message in the chat and wait for approval** before running
   `git commit`.
5. **No tool attribution in commit messages**: no `Co-Authored-By`, no "Generated with", no
   similar trailers.

## Where to look

| Need | Doc |
| --- | --- |
| Folder layout, component patterns, enums, types, styling | [docs/conventions/coding-style.md](docs/conventions/coding-style.md) |
| Testing status | [docs/conventions/testing.md](docs/conventions/testing.md) |
| Branches, slices, commits, push policy | [docs/conventions/git-workflow.md](docs/conventions/git-workflow.md) |
| Rules that break the app if violated (R1–R11) | [docs/rules/frontend-invariants.md](docs/rules/frontend-invariants.md) |
| Apollo setup, providers, routes, env vars, data flows | [docs/architecture.md](docs/architecture.md) |
