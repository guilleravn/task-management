# Architecture

A single-page React app with no backend of its own. The browser talks directly to an external
GraphQL API; React renders what comes back.

```
Browser ── Apollo Client (HttpLink + InMemoryCache) ── POST ──▶ External GraphQL API (Railway)
   │
   └─ URL search params (?q, ?points, ?tags, ?dueDate, ?assigneeId) ── shared UI state
```

## Boot sequence

1. `index.html` loads `/src/main.tsx` as an ES module.
2. `main.tsx` imports `index.css` (which imports `styles/tokens.css` and `styles/global.css`) and
   renders `<App />` inside `<StrictMode>`.
3. `App.tsx` mounts the provider stack below.

## Provider stack (`src/App.tsx`)

```
ErrorBoundary                    catch-all: renders "Something went wrong." instead of a blank page
└─ ApolloProvider                makes the client available to useQuery / useMutation
   ├─ RouterProvider             renders the route tree from src/routes/router.tsx
   └─ Toaster (top-right)        single toast outlet for the whole app
```

The order is an invariant — see R8 in [rules/frontend-invariants.md](rules/frontend-invariants.md).

## Routes (`src/routes/router.tsx`)

Built with `createBrowserRouter`. Every route is a child of `AppLayout`.

| Path | Element | Notes |
| --- | --- | --- |
| `/` (index) | `<Navigate to="/dashboard" replace />` | Redirect |
| `/dashboard` | `DashboardPage` → `<Board />` | All tasks |
| `/my-task` | `MyTaskPage` → `<Board onlyMine />` | Tasks assigned to the current profile |
| `/settings` | `SettingsPage` → `<ProfileCard />` | Current profile details |
| `*` | `NotFoundPage` | 404 inside the layout |
| (error) | `ErrorPage` | `errorElement` of the root route; shows status for route errors |

`AppLayout` renders `Sidebar` (a drawer on small screens, opened from `Header`'s menu button),
`Header` (search, avatar → `/settings`), `MobileTabBar`, and the active page in `<Outlet />`.

## Apollo Client (`src/lib/apollo-client.ts`)

```ts
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL,
  headers: { Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}` },
})

export const apolloClient = new ApolloClient({ link: httpLink, cache: new InMemoryCache() })
```

- **One link**: `HttpLink` only. No error link, retry link, or auth link — the token is a static
  header set once when the module loads. Changing `.env` requires restarting the dev server.
- **Default normalized cache**: `InMemoryCache` with no `typePolicies`. Objects are stored by
  `__typename:id` (e.g. `Task:abc`). Any query or mutation response containing an object with
  that identity updates every component reading it.
- **Default fetch policy** (`cache-first`) is used everywhere; no query overrides it.
- Hooks are imported from `@apollo/client/react` (`useQuery`, `useMutation`, `ApolloProvider`);
  `gql`, `TypedDocumentNode` and the client classes from `@apollo/client`.

### Operations in use

| Operation | File | Used by |
| --- | --- | --- |
| `GetTasks($input: FilterTaskInput!)` | `features/tasks/graphql/queries.ts` | `Board` |
| `GetUsers` | `features/tasks/graphql/queries.ts` | `AssigneePicker`, `BoardToolbar` |
| `GetProfile` | `features/profile/graphql/queries.ts` | `Header`, `Board` (My Task), `ProfileCard` |
| `CreateTask($input: CreateTaskInput!)` | `features/tasks/graphql/mutations.ts` | `useCreateTask` → `CreateTaskModal` |
| `UpdateTask($input: UpdateTaskInput!)` | `features/tasks/graphql/mutations.ts` | `useUpdateTask` → `EditTaskModal`; `useMoveTask` → `Board` (drag and drop) |
| `DeleteTask($input: DeleteTaskInput!)` | `features/tasks/graphql/mutations.ts` | `useDeleteTask` → `TaskActionsMenu` |

Task mutations are only called through the hooks in `features/tasks/hooks/useTaskMutations.ts`,
which own how task lists are refreshed (R9).

`GET_PROFILE` is used by three components but hits the network once: the other two read it
from the cache.

### Adding a new query or mutation

1. Put the document in the feature's `graphql/queries.ts` or `graphql/mutations.ts`, declared
   as `TypedDocumentNode<Result, Variables>` with the result/variables interfaces next to it.
2. **Always select `id`** on every object that has one, so the cache can normalize it.
3. If it returns `Task`, select the full task field set (R4).
4. Update `types.ts` by hand to match the selection — nothing generates or validates it against
   the schema.
5. For a task mutation, add a hook to `features/tasks/hooks/useTaskMutations.ts` and decide its
   refresh strategy there (R9). If it can add, remove, or move tasks between filtered lists, it
   needs `refetchQueries: [GET_TASKS]` — the normalized cache doesn't add or remove list items on
   its own.
6. Await mutations in `try/catch` with toasts, and disable the trigger while `loading`.

## Deployment

The app is deployed to Vercel as a static build (`dist/`). Because routing happens on the client
(`createBrowserRouter`), `vercel.json` rewrites every path to `/index.html`. Without it, loading a
deep route directly (e.g. opening `/settings` in a new tab) returns Vercel's 404 page. Vercel
serves files that exist in `dist/` (JS, CSS, images) before applying rewrites, so assets are not
affected.

## Environment variables

Defined in `.env` (gitignored), documented in `.env.example`. Only `VITE_`-prefixed variables are
exposed to the client, through `import.meta.env`.

| Variable | Used in | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `lib/apollo-client.ts` | GraphQL endpoint (`.env.example` points at the Railway deployment) |
| `VITE_API_TOKEN` | `lib/apollo-client.ts` | Bearer token sent in `Authorization` on every request |

Both values are inlined into the JS bundle at build time. The token is therefore public to
anyone who loads the app.

## Main data flows

### Search
1. User types in `Header`; the input is local state and updates on every keystroke.
2. The same `onChange` calls a `useDebouncedCallback` writer; 300 ms after the last keystroke it
   sets `?q=` (functional update, `replace: true`). If `q` changes from outside (back button),
   `Header` copies it into the input.
3. `Board` reads `q` with `useSearchParams` → `GET_TASKS` variables change → Apollo sends a new
   request; skeletons show while `loading`.
4. Tasks render grouped by `STATUS_VALUES` in `BoardColumns` (grid) or `BoardList` (list).

### Filters
`BoardToolbar` pickers write `status`, `points`, `tags`, `dueDate`, `assigneeId` through
`useTaskFilters()`. `Board` reads them through the same hook and maps them to `FilterTaskInput`.
With a `status` filter, the grid and the list show only that status's column or group.
The hook validates every value coming from the URL, so invalid params are ignored (R1).
"Clear filters" calls the hook's `clear()`, which deletes every filter param (not `q`).

### My Task
`Board onlyMine` runs `GET_PROFILE`; `GET_TASKS` is skipped until the profile id exists, then
runs with `assigneeId = profile.id` (R7).

### Create / edit / delete
The modal or menu calls its hook from `useTaskMutations.ts`, awaits it and shows a toast. The
hook refetches every active `GetTasks` query, so the visible board is refreshed whatever
search or filters are applied. Delete also evicts `Task:<id>` from the cache first, so the card
disappears immediately (R9).

### Drag and drop (grid view)
`DndContext` lives in `Board`; each `BoardColumn` is a droppable (id = status) with a
`SortableContext`; each card is a `SortableTaskCard`. A `DragOverlay` renders the dragged
`TaskCard`. On drop, one `updateTask` with a fractional `position` and an `optimisticResponse`
is sent (R5).

## Derived display logic

- `features/tasks/dueDateDisplay.ts` — due-date label and color: done/cancelled → on-time color;
  overdue → `--color-overdue`; less than 2 days → `--color-due-soon`; otherwise
  `--color-on-time`. Shared by `TaskCard` and `BoardListRow`.
- `features/tasks/reorderPosition.ts` — midpoint position for drag and drop.
- `lib/dicebear.ts` — legacy avatar URL rewrite (R11).

## Known loose ends (as of this doc)

- `features/tasks/mock-data.ts` is not imported anywhere (dead code from before the API was
  wired).
- `README.md` says the grid/list toggle lives in the URL; it is `useState` in `Board`.
- `README.md` lists `ErrorBoundary` under `components/ui/`; it is at
  `components/ErrorBoundary.tsx`.
