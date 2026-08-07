# Task Management

A Kanban-style task management app built as a take-home challenge. It connects to a GraphQL API to browse, create, edit and delete tasks, assign them to users, tag and estimate them, and filter/search across the board — with both a grid (Kanban) and a list layout, and a responsive mobile experience.

## Table of contents

- [Screenshots](#screenshots)
- [Setup / running the app](#setup--running-the-app)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Tech stack](#tech-stack)
- [Rationale](#rationale)
- [Features](#features)
- [Known limitations / not implemented](#known-limitations--not-implemented)

## Screenshots

<!-- TODO: add screenshots/gifs of the dashboard (grid + list view), task create/edit, filters, and the mobile responsive layout. -->

## Setup / running the app

### Prerequisites

- Node.js 20+
- An API access token for the challenge's GraphQL API (sent by email — check spam or ask whoever is running your interview if you didn't get it)

### Installation

1. Clone the repository and install dependencies:

   ```bash
   git clone <repo-url>
   cd task-management
   npm install
   ```

2. Create a `.env` file in the project root with the API URL and your token:

   ```bash
   VITE_API_URL=<graphql-api-url>
   VITE_API_TOKEN=<your-access-token>
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## Available scripts

| Script            | Description                                  |
| ------------------ | --------------------------------------------- |
| `npm run dev`      | Start the Vite dev server with HMR            |
| `npm run build`    | Type-check (`tsc -b`) and build for production |
| `npm run lint`     | Run ESLint over the project                   |
| `npm run preview`  | Preview the production build locally          |

## Project structure

```
src/
  components/       # Generic, reusable, no business logic
    layout/          # AppLayout, Header, Sidebar, MobileTabBar
    ui/              # Popover, Modal, Avatar, PillButton, ErrorBoundary
    icons/           # One SVG component per icon
  features/         # Domain logic, grouped by feature
    tasks/           # Board, TaskCard, filters/pickers, GraphQL queries & mutations, enums, types
    profile/         # Profile card, GraphQL queries, enums, types
  pages/            # Thin route components that delegate to features
  hooks/            # Generic reusable hooks (useDebouncedValue, useUrlParam)
  lib/              # Infra: Apollo Client setup, Dicebear avatar helper
  routes/           # React Router configuration
  styles/           # Design tokens and global styles
```

The split favors *what changes together*: anything specific to tasks or the user profile lives inside its feature folder (components, GraphQL documents, enums and types all together), while `components/` stays generic and reusable across features.

## Tech stack

- **React 19 + TypeScript** — UI and type safety across components, hooks and GraphQL data.
- **Vite** — dev server and build tooling.
- **Apollo Client** (`@apollo/client`) — GraphQL queries/mutations, cache and loading/error state, using the `TypedDocumentNode<TData, TVariables>` pattern so every query/mutation is typed end-to-end without manual generics.
- **React Router** — routing, plus `useSearchParams` as the mechanism for shareable, deep-linkable UI state (filters, search, view).
- **CSS Modules** — component-scoped styles, backed by a small set of design tokens (`src/styles/tokens.css`) for color, spacing, typography and radius.
- **react-hot-toast** — lightweight success/error feedback for mutations.
- **ESLint + typescript-eslint** — linting, including the `react-hooks` plugin's stricter rules (e.g. flags `setState` calls inside effects).

## Rationale

- **Apollo Client over raw `fetch`**: the API is GraphQL, and Apollo gives normalized caching and `refetchQueries` for free, which is what invalidates the task list after a create/update/delete mutation without any manual cache bookkeeping.
- **URL search params instead of Context/Redux for shared UI state**: search, filters (points, tags, due date, assignee) and the grid/list toggle all live in the URL via a small generic `useUrlParam<T>` hook. This keeps state shareable via link, durable across refreshes, and avoids introducing a global state library for what is, in the end, page-local UI state shared between a couple of sibling components.
- **Container vs. presentational split for the board**: `Board` owns the `GET_TASKS` query, filter reading and loading/error/empty states; `BoardColumns` and `BoardList` are purely presentational (`tasks: Task[]` in, JSX out). This is what let the list-view bonus reuse the exact same data and filtering logic as the grid view with zero duplication.
- **Shared `TaskActionsMenu` and `getDueDateDisplay`**: the options menu (Edit/Delete) and the due-date color logic are each implemented once and reused by both the Kanban card and the list row, instead of being re-implemented per view.
- **Enums as `const` arrays instead of TS `enum`**: `STATUS_VALUES`, `TASK_TAG_VALUES`, etc. are `as const` arrays with a derived union type, paired with `_LABELS` records for display text. This keeps the values iterable (for rendering filter options, board columns, etc.) while staying just as type-safe as a real enum.
- **CSS Modules + design tokens over a UI/component library**: the design has a small, consistent set of colors/spacing/radii, so centralizing them as CSS custom properties and consuming them from per-component CSS Modules was enough to stay consistent without pulling in a styling framework.

## Features

**Core**
- Browse tasks in a Kanban board, grouped by status
- Create, edit and delete tasks (name, status, tags, due date, point estimate, assignee)
- Search by name, and filter by point estimate, tags, due date and assignee
- "My Task" view (tasks assigned to the current user)
- User profile / settings page

**Bonus**
- Task count per column/group (e.g. `Todo (4)`, `Backlog (03)`), in both views
- Due date colored by delay: green (on time), yellow (less than 2 days left), red (overdue) — shared between the grid and list views
- List view: tasks as a table grouped by collapsible status sections, as an alternative to the Kanban grid
- Responsive layout: the sidebar becomes a slide-out drawer, primary navigation moves to a tab bar under the header, the search field collapses to an icon, and task creation becomes a floating action button on small screens

## Known limitations / not implemented

- **Automated tests**: not included. Given the scope and time available, effort went into the features above instead; `getDueDateDisplay` (a pure function) would be the highest-value first test to add.
- **Drag & drop**: not implemented — reordering tasks depends on the schema's `position` field, which wasn't wired up pending confirmation of its intended semantics.
- **Global state via Context/Reducer**: intentionally not used — see [Rationale](#rationale). All shared UI state is modeled through the URL instead.
