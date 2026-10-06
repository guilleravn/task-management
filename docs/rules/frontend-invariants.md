# Frontend invariants

Rules that, if broken by accident, break the app — often silently, because the build still
passes. Each rule states what it requires, what it protects, and how it breaks.

If a change needs to violate one of these, that is a design decision: raise it in the plan,
don't just do it. If a rule turns out to be wrong, change this doc in the same commit as the
code.

---

## R1 — The URL is the single source of truth for search and filters

**Requires.** Search and board filters live only in the URL search params:

| Param | Written by | Read by | Format |
| --- | --- | --- | --- |
| `q` | `Header` (debounced, see R2) | `Board` | raw string |
| `points` | `BoardToolbar` | `Board`, `BoardToolbar` | a `PointEstimate` value |
| `tags` | `BoardToolbar` | `Board`, `BoardToolbar` | comma-separated `TaskTag` values |
| `dueDate` | `BoardToolbar` | `Board`, `BoardToolbar` | ISO string (`Date.toISOString()`) |
| `assigneeId` | `BoardToolbar` | `Board`, `BoardToolbar` | user id |

Components read and write them through `useSearchParams` / `useUrlParam`. Updates use
`{ replace: true }` and the functional form `setSearchParams(params => …)`. An empty serialized
value deletes the param.

`Board` and `BoardToolbar` each declare their own `useUrlParam` calls for the same keys, with
**identical** `serialize`/`deserialize` functions. If you change one, change the other.

**Protects.** `Header` and `Board` are siblings in the layout and never pass filter state to
each other — the URL is how they communicate. It also makes filtered views linkable and keeps
them across refresh.

**Breaks when.**
- Someone moves a filter into `useState` or passes it down as a prop: the other reader stops
  seeing changes, and refresh/shared links lose it.
- The serializer in `BoardToolbar` changes but the deserializer in `Board` doesn't (or the
  reverse): the picker shows one value and the query uses another.
- `setSearchParams` is called with a fresh object instead of the functional updater: it wipes
  the other params (e.g. setting `q` drops `tags`).
- `replace: true` is dropped: every keystroke or filter click adds a history entry and the back
  button stops being useful.

The grid/list view toggle is **not** in the URL — it is `useState` in `Board`, so it resets on
refresh and on navigation. That is the current behavior, not part of this rule.

---

## R2 — Search is debounced before it reaches the URL

**Requires.** `Header` keeps the input in local state and writes `q` only from
`useDebouncedValue(inputValue, 300)` — 300 ms after the last keystroke.

**Protects.** `q` is a `GET_TASKS` variable. Without the debounce, every keystroke changes the
query variables and fires a network request.

**Breaks when.** The input writes to the URL directly in `onChange`, or `Board` reads the raw
input instead of `q`: one request per character, and responses can arrive out of order.

---

## R3 — No client-side global store; server data lives in the Apollo cache

**Requires.** There is no Redux, Zustand, MobX, or React Context used as a state store.
Shared UI state goes in the URL (R1). Server data lives in Apollo's `InMemoryCache` and is read
with `useQuery`. Local `useState` is for UI-only state (open/closed, view mode, drag overlay)
and for form drafts seeded from props (`EditTaskModal`).

**Protects.** One source of truth per piece of state. A mutation that returns a `Task` updates
every component showing it through the normalized cache, with no manual syncing.

**Breaks when.**
- A store or Context is added "to keep the filters": now the URL and the store can disagree,
  and every writer has to update both.
- Query results are copied into `useState` or a store: the copy goes stale as soon as a
  mutation updates the cache, and the UI stops reflecting edits.

This is an architectural decision, not an omission. Adding a store needs a plan and a reason
the URL + Apollo cache can't cover.

---

## R4 — Task operations select the same fields, including `id`

**Requires.** `GET_TASKS`, `CREATE_TASK` and `UPDATE_TASK` select the same task fields:
`id name status tags dueDate pointEstimate position assignee { id fullName avatar }`. The `Task`
type in `types.ts` matches that selection. `DELETE_TASK` selects at least `id`.

**Protects.** Apollo normalizes by `__typename` + `id` (no custom `typePolicies`). When an
`updateTask` response comes back with the full field set, the cached `Task:<id>` is replaced
consistently, and both the board and any open view update without a refetch. The drag-and-drop
optimistic update (R5) depends on this too.

**Breaks when.**
- A field is added to `GET_TASKS` but not to the mutations: after an edit, that field in the
  cache is stale.
- `id` is dropped from a selection: Apollo can't normalize the object and the update doesn't
  reach the list.
- A field is added to `Task` in `types.ts` but not to the selections: TypeScript says it exists,
  it's `undefined` at runtime.

---

## R5 — Drag and drop updates one task, optimistically

**Requires.** In `Board.handleDragEnd`:

1. The target column is resolved from `over.id` — either a column (`useDroppable({ id: status })`
   in `BoardColumn`) or a task in that column.
2. The column's tasks are taken **without the dragged task**, sorted by `position` ascending.
3. The new position comes from `getReorderedPosition(columnTasks, dropIndex)`:
   midpoint of the neighbours, `after - 1` at the top, `before + 1` at the bottom, `0` in an
   empty column. Positions are fractional numbers.
4. If neither status nor position changed, nothing is sent.
5. Exactly **one** `updateTask` is sent, through `useMoveTask` (`hooks/useTaskMutations.ts`),
   with `{ id, status, position }` and an `optimisticResponse` built by spreading the cached
   task: `{ updateTask: { ...task, status, position } }`. It does not refetch (R9).
6. On failure: `toast.error(...)`. There is no manual rollback.

**Protects.** The card moves instantly, a reorder costs one request, and failure is safe:
Apollo discards the optimistic layer when the mutation errors, so the card returns to where the
server says it is.

**Breaks when.**
- The column is renumbered (N mutations per drop): N requests, partial failures leave the column
  in an inconsistent order, and optimistic rollback no longer matches.
- The dragged task is left in `columnTasks`: indexes are off by one and drops land in the wrong
  place.
- The `optimisticResponse` is built by hand without spreading the cached task: it may miss
  `__typename` or fields, so it doesn't normalize to `Task:<id>` and the UI either doesn't move
  or flickers.
- Someone adds manual "undo" state on error: it fights Apollo's own rollback.
- `PointerSensor`'s `activationConstraint: { distance: 8 }` is removed: every click on a card
  (including its options menu) starts a drag.
- The `onPointerDown` `stopPropagation` is removed from `Modal`. The Edit and Delete modals are rendered by
  the card's `TaskActionsMenu`, and React bubbles events along the React tree **even through
  `createPortal`**. Without the stop, a pointer drag inside the modal (e.g. selecting text in the
  name input) reaches the card's dnd-kit listeners and starts dragging the card behind it. The
  portal alone does not prevent this.

Drag and drop exists only in the grid view. The list view has no DnD context.

---

## R6 — Ordering is by `position`, computed on the client

**Requires.** `BoardColumns` filters by status and sorts by `position` ascending before
rendering, and R5 computes drop indexes over that same ordering.

**Protects.** The order the user sees is the order `getReorderedPosition` reasons about. If they
differ, a drop lands somewhere other than where the card was released.

**Breaks when.** A column renders tasks in API order, or sorts by another field, while DnD still
assumes `position` order.

`BoardList` currently groups by status **without** sorting by `position`, so list order can
differ from grid order. Sort there too if list order starts to matter.

---

## R7 — "My Task" never queries tasks before it has the profile id

**Requires.** When `Board` has `onlyMine`, it runs `GET_PROFILE`, and `GET_TASKS` stays
`skip`ped while `isWaitingForProfile` (profile loading or no `id` yet). The `assigneeId`
variable is the profile id; the URL `assigneeId` param is ignored, and `BoardToolbar` hides the
assignee picker and skips `GET_USERS`. Skeletons render while waiting.

**Protects.** Without the skip, the first request goes out with `assigneeId: undefined`, which
means **no assignee filter**: "My Task" would briefly show (and cache) every task in the system.

**Breaks when.** The `skip` is removed or reduced to `profileLoading` only, or `assigneeId` falls
back to the URL param in "My Task".

---

## R8 — Provider order in `App.tsx`

**Requires.**

```
ErrorBoundary
└─ ApolloProvider
   ├─ RouterProvider
   └─ Toaster
```

**Protects.**
- `ErrorBoundary` is outermost, so a crash anywhere (including in providers) shows a fallback
  instead of a blank page. Route-level errors are handled first by the router's
  `errorElement: <ErrorPage />`.
- `ApolloProvider` wraps the router, so every route, layout component (`Header`) and page can use
  `useQuery`/`useMutation`.
- `Toaster` is mounted once, outside the routes, so toasts survive navigation and modals closing.

**Breaks when.** `ApolloProvider` moves inside a route or layout (components outside it crash
on `useQuery`), or `Toaster` is mounted per page (toasts disappear on navigation or are
duplicated).

---

## R9 — Task mutations refresh every active task list, from one place

**Requires.** Components never call `useMutation` for tasks directly. They use the hooks in
`src/features/tasks/hooks/useTaskMutations.ts`, which own the refresh strategy:

| Hook | Used by | Refresh |
| --- | --- | --- |
| `useCreateTask` | `CreateTaskModal` | `refetchQueries: [GET_TASKS]` |
| `useUpdateTask` | `EditTaskModal` | `refetchQueries: [GET_TASKS]` |
| `useDeleteTask` | `TaskActionsMenu` | `cache.evict` + `cache.gc()`, then `refetchQueries: [GET_TASKS]` |
| `useMoveTask` | `Board` (drag and drop) | none — optimistic normalized update (R5) |

Passing the **document** (`[GET_TASKS]`) refetches every *active* `GetTasks` query with its own
variables. Never use the `{ query, variables }` form, which only refetches that one variable set.
Every mutation is awaited in `try/catch` with a success and an error toast.

**Protects.** Apollo caches one list per variable set (search, filters, "My Task"). The
normalized cache can update a task that is already in a list, but it can't decide whether a
task should **enter or leave** a filtered list — only the server knows how its filters match:
- create: the new task must appear in every list whose filters it matches;
- edit: changing tags, estimate, due date or assignee can move a task in or out of a filtered
  list;
- delete: the task must disappear from every list. Eviction does that immediately; the refetch
  confirms.

Writing created tasks into the cache by hand was rejected: it would mean re-implementing the
server's filter semantics (e.g. how `name` search matches) on the client.

**Breaks when.**
- A component calls `useMutation(CREATE_TASK | UPDATE_TASK | DELETE_TASK)` directly: it bypasses
  the strategy and filtered boards go stale again.
- The refetch is changed to `{ query: GET_TASKS, variables: { input: {} } }`: only the unfiltered
  list refreshes; with a search or filter active, created tasks don't appear and deleted/edited
  ones linger.
- A refetch is added to `useMoveTask`: every drag triggers a network round-trip and the list
  flickers while the optimistic result is replaced.
- A new task mutation is added without deciding its refresh strategy in the hooks file.

---

## R10 — Enum strings match the API exactly

**Requires.** The values in `STATUS_VALUES`, `TASK_TAG_VALUES`, `POINT_ESTIMATE_VALUES` and
`USER_TYPE_VALUES` are the API's GraphQL enum values, byte for byte (`IN_PROGRESS`, `NODE_JS`,
`EIGHT`, …). Display text goes in the `*_LABELS` maps, never in the values.

**Protects.** These strings are sent verbatim as query/mutation variables and compared against
response data. There is no codegen (see coding-style), so nothing else catches a mismatch.

**Breaks when.** A value is "prettified" or renamed: the API rejects the variable, or the task
doesn't land in any column because `task.status` matches no `STATUS_VALUES` entry.

---

## R11 — Avatar URLs go through `normalizeAvatarUrl`

**Requires.** Every avatar `src` built from API data passes through
`normalizeAvatarUrl()` (`src/lib/dicebear.ts`) before reaching `<Avatar>`.

**Protects.** The API returns legacy `https://avatars.dicebear.com/api/<style>/<seed>.svg`
URLs, which no longer resolve. The helper rewrites them to `https://api.dicebear.com/9.x/...`.
`Avatar` also falls back to a generic image on load error, but that loses the user's avatar.

**Breaks when.** A new component renders `user.avatar` directly: broken images or every user
showing the fallback.

---

## Security note (not an invariant, a constraint)

`VITE_API_TOKEN` is read via `import.meta.env` and **is inlined into the client bundle** at
build time — anyone can read it in DevTools. That's acceptable for this challenge setup only.
`.env` is gitignored; never commit it, and never put a token in `.env.example`.
