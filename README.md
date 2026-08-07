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

## Screenshots
PAGES
Dashboard Page:

<img width="1917" height="928" alt="{B2F3330A-FFB0-4C01-AA3E-9A551DF498F2}" src="https://github.com/user-attachments/assets/413aa958-02ae-41d9-af2f-858953eaec65" />

My Task Page:

<img width="1899" height="927" alt="{D9F14555-AE58-4D79-B693-B0689EB45B86}" src="https://github.com/user-attachments/assets/de998998-8bd2-4bdd-a924-2ddfd83f17e0" />

Settings and Profile Page:

<img width="1920" height="927" alt="{548C246F-5313-4839-BB84-2429E04DDD84}" src="https://github.com/user-attachments/assets/b8305c04-0c4e-4fc2-944e-53f2c263af39" />

List View:

<img width="1873" height="903" alt="{461A70DC-3434-4CA2-B0B3-4D7F7855B5D0}" src="https://github.com/user-attachments/assets/67785083-d215-4393-997e-49df29a4f6fa" />


MODALS:
New Task:

<img width="891" height="393" alt="{82ECE2F8-46A7-40FA-9FB0-A12E56F18048}" src="https://github.com/user-attachments/assets/7c79b19c-fe10-4231-b7fe-22185dad57e7" />
<img width="735" height="400" alt="{AF46844C-BE90-4420-9FA1-A3DB35644403}" src="https://github.com/user-attachments/assets/6b21a29b-269e-472b-b257-73269fac2783" />
<img width="748" height="418" alt="{D252EC2A-0108-45FD-A6EA-553A7ACDACF8}" src="https://github.com/user-attachments/assets/22020a11-1693-4610-bc85-59eda801e5f3" />
<img width="777" height="437" alt="{E2CE1169-52E7-4221-8E4F-5A5368DA9DE0}" src="https://github.com/user-attachments/assets/71698cd5-b4eb-4b93-9ada-9c340ccdc8c1" />
<img width="889" height="526" alt="{A0560C54-6ACB-4A80-8C9C-C62BC25B0027}" src="https://github.com/user-attachments/assets/c11fcd57-6035-44eb-a382-01b9d99ff3f5" />

Update Task

<img width="507" height="231" alt="{69EC3935-6387-4BB5-A79D-893BB7F54724}" src="https://github.com/user-attachments/assets/67301588-64a4-44fe-8bcb-7b7b444060f1" />
<img width="742" height="288" alt="{3AF75CB5-12C6-4A9A-B283-14001916C849}" src="https://github.com/user-attachments/assets/e86ba21e-4601-45b8-a050-06517e66b2ba" />

Delete Task:

<img width="493" height="241" alt="{8ED350B4-95D4-4E51-9315-DE89C13BBD28}" src="https://github.com/user-attachments/assets/1730e052-6b81-464b-9c43-a9784984400b" />
<img width="715" height="152" alt="{67C84374-CB7C-4394-B8B8-896D4DF2E01C}" src="https://github.com/user-attachments/assets/2d84297c-0f89-4e37-8a4d-b8996877ad94" />


RESPONSIVE:

<img width="438" height="863" alt="{F635CF59-6D92-4943-889A-F31549F19B66}" src="https://github.com/user-attachments/assets/b380185d-7dce-42c6-976a-df7f8aa4acd2" />
<img width="461" height="855" alt="{67EFD0CF-71E1-451A-8B6E-F75288017213}" src="https://github.com/user-attachments/assets/0ae73d9f-2e0c-4677-9e1e-32d01f799b0b" />


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

