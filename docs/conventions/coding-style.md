# Coding style

These conventions are derived from the code as it exists today. When the code and this doc
disagree, fix one of them in the same change — don't leave them drifting.

## Folder layout

```
src/
  main.tsx        Entry point: createRoot + <StrictMode> + <App />
  App.tsx         Provider stack (see docs/architecture.md)
  index.css       Imports tokens.css and global.css
  lib/            Infrastructure: Apollo client, external-service helpers (DiceBear)
  routes/         Router configuration (router.tsx)
  pages/          Thin route components — one per route
  features/       Domain code, grouped by domain
    tasks/          components/, graphql/, types.ts, enums.ts, pure helpers
    profile/        components/, graphql/, types.ts, enums.ts
  components/     Shared, cross-feature building blocks
    layout/         AppLayout, Header, Sidebar, MobileTabBar
    ui/             Modal, Popover, Avatar, PillButton
    icons/          One SVG component per icon
    ErrorBoundary.tsx
  hooks/          Generic hooks with no domain knowledge (useUrlParam, useDebouncedValue)
  styles/         tokens.css (design tokens) and global.css (reset/base)
```

### Why `features/` is grouped by domain

Code is grouped by **what changes together**. Adding a field to a task touches its type, its
GraphQL documents, and the components that render it — all of which live under
`features/tasks/`. Grouping by file type (`components/`, `queries/`, `types/` at the top level)
would spread one change across the whole tree.

### What goes where

- **`pages/`** — thin. A page renders a feature component and nothing else, e.g.
  `DashboardPage` → `<Board />`, `MyTaskPage` → `<Board onlyMine />`,
  `SettingsPage` → `<ProfileCard />`. No queries, no state, no layout in pages.
  (`ErrorPage` and `NotFoundPage` are self-contained because they have no feature behind them.)
- **`features/<domain>/`** — anything that knows about a domain concept: components, GraphQL
  documents, types, enums, and pure helpers (`reorderPosition.ts`, `dueDateDisplay.ts`).
  Features may import from other features when they need that data (e.g. `Board` imports
  `GET_PROFILE` from `features/profile`).
- **`components/ui/` and `components/icons/`** — generic. They must not import from
  `features/`. A `Popover` doesn't know what a task is.
- **`components/layout/`** — the app shell. It is shared, but it is *not* domain-free:
  `Header` queries `GET_PROFILE` and writes the `q` search param. Keep domain usage in layout to
  what the shell genuinely needs.
- **`hooks/`** — only generic hooks. A hook that knows about tasks belongs in `features/tasks/`.
- **`lib/`** — singletons and adapters for external things (Apollo client, avatar URL fixing).

## Components

- Function components, **named exports** (`export function Board()`). The only default export
  is `App`.
- One component per file; the file name matches the component name.
- Props are typed with a local `interface <Component>Props`.
- Boolean props default in the destructuring (`{ onlyMine = false }`).
- Generic UI that needs to close itself exposes a render prop: `Popover` accepts
  `children: ReactNode | ((close) => ReactNode)`.
- Icons are plain components that render inline SVG with `fill="currentColor"` and
  `aria-hidden="true"`, so color comes from CSS.

### Container / presentational split

Used where one data source feeds more than one rendering:

- **Container — `Board`**: reads the filters from the URL, runs `GET_TASKS` (and `GET_PROFILE`
  for "My Task"), owns loading / error / empty states, the view toggle, the drag-and-drop
  context and the create modal.
- **Presentational — `BoardColumns`, `BoardList`** (and below them `BoardColumn`,
  `BoardListGroup`, `BoardListRow`, `TaskCard`): take `tasks: Task[]` and render. They don't
  run the task query.

This is why the grid and list views share all data and filtering logic. When adding a new view,
make it another presentational component fed by `Board`; don't give it its own `GET_TASKS`.

Not every component follows this split, and that's intended: leaf components that own a
self-contained interaction run their own mutation (`TaskActionsMenu` → `DELETE_TASK`,
`EditTaskModal` → `UPDATE_TASK`, `CreateTaskModal` → `CREATE_TASK`), and pickers that need a
lookup list run it themselves (`AssigneePicker` → `GET_USERS`). Apollo deduplicates and caches,
so this doesn't cost extra requests.

## Enums: `as const` arrays, not TypeScript `enum`

```ts
export const STATUS_VALUES = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'] as const
export type Status = (typeof STATUS_VALUES)[number]
export const STATUS_LABELS: Record<Status, string> = { ... }
```

- **TypeScript `enum` is not allowed**: both `tsconfig.app.json` and `tsconfig.node.json` set
  `erasableSyntaxOnly: true`, which rejects `enum` (it emits runtime code).
- The array is iterable, so it drives rendering directly: board columns and list groups come
  from `STATUS_VALUES.map(...)`, picker options from `POINT_ESTIMATE_VALUES` / `TASK_TAG_VALUES`.
- Display text and other per-value data live in `Record<Union, ...>` maps next to the array
  (`*_LABELS`, `TASK_TAG_COLOR_VARS`). Using `Record` means adding a value to the array makes
  every map fail to compile until it is filled in.
- The string values must match the API's GraphQL enum values exactly (see invariant R10).

Existing sets: `features/tasks/enums.ts` (`Status`, `TaskTag`, `PointEstimate`) and
`features/profile/enums.ts` (`UserType`).

## GraphQL types are hand-written (no codegen)

- Domain types live in `features/<domain>/types.ts` (`Task`, `User`, `FilterTaskInput`,
  `Profile`). Result/variables/input types for each operation live next to the operation in
  `graphql/queries.ts` / `graphql/mutations.ts`.
- Every document is declared as `TypedDocumentNode<TResult, TVariables>`, so `useQuery` /
  `useMutation` infer types without explicit generics. Keep doing this for new operations.
- **Nothing checks these types against the real schema.** If the API changes a field, nullability
  or enum value, TypeScript will still compile and the bug shows up at runtime. Any change to an
  operation's selection set or to the API contract requires updating `types.ts` and the
  operation's types by hand, in the same change.
- The task field selection (`id name status tags dueDate pointEstimate position assignee { id
  fullName avatar }`) is repeated in `GET_TASKS`, `CREATE_TASK` and `UPDATE_TASK`. Keep them
  identical (invariant R4).

## React Compiler: no manual memoization

The React Compiler is enabled for all of `src/` (`vite.config.ts`). It memoizes components,
values and callbacks at build time.

- **Do not write `useMemo`, `useCallback` or `React.memo`.** There are none in the codebase
  today. Seeing one in a diff is a red flag: either code written before the compiler, or
  someone not trusting it. If a real performance problem is measured, discuss it first.
- The compiler depends on components following the Rules of React (pure render, no mutating
  props/state, hooks at the top level). `eslint-plugin-react-hooks` v7 (recommended flat config)
  enforces these — treat its errors as real bugs, not noise.
- Adjusting state when a prop changes is done during render, not in an effect (see `Avatar`,
  which compares `src` to `lastSrc`).

## TypeScript

- `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`.
- `verbatimModuleSyntax`: type-only imports must use `import type` / inline `type`
  (`import { gql, type TypedDocumentNode } from '@apollo/client'`).
- ESLint forbids `any` (`no-explicit-any: error`) and `@ts-ignore`/`@ts-expect-error`
  (`ban-ts-comment: error`). Unused args are allowed only with a `_` prefix.
- Casting is used only at trust boundaries, e.g. URL param deserializers (`raw as PointEstimate`).

## Styling: CSS Modules + design tokens

- Every component that needs styles has a sibling `<Component>.module.css`, imported as
  `styles` and used as `className={styles.x}`. Components with variants (e.g. the skeleton) may
  reuse a sibling's module.
- Conditional classes are composed with a template string:
  `isOpen ? `${styles.sidebar} ${styles.open}` : styles.sidebar`. There is no `clsx`.
- All colors, spacing, font sizes, radii and shadows come from CSS custom properties in
  `src/styles/tokens.css` (`var(--color-primary)`, `var(--space-4)`, …). Don't hardcode values
  that have a token. (A few `color: #ffffff` literals exist in module files today — use a token
  if you touch them.)
- The theme is dark and fixed by design; there is no light theme or `prefers-color-scheme`
  handling.
- Inline `style={{...}}` is only for values computed at runtime from data: due-date colors,
  tag colors (`color-mix(in srgb, var(--tag-x) 10%, transparent)`), dnd-kit transforms, and
  skeleton widths.
- No Tailwind, no CSS-in-JS, no component library.

## Formatting

No Prettier config exists. Match the surrounding code: 2-space indent, single quotes, no
semicolons, trailing commas in multi-line literals. (`Avatar.tsx` deviates — 4 spaces and
semicolons — and is the exception, not the norm.)

## User feedback

- Every mutation is awaited inside `try/catch`: success → `toast.success('Task created')`,
  failure → `toast.error('Could not <verb> the task. Please try again.')`.
- Query states are explicit in the container: skeletons while loading (`BoardColumnSkeleton`),
  an error state with retry (`BoardError` → `refetch()`), and an empty state (`BoardEmpty`).
- Buttons that trigger a mutation are disabled while it's in flight (`loading` from
  `useMutation`).

## Accessibility basics already in place

Icon-only buttons have `aria-label`; decorative SVGs are `aria-hidden`; the search input has a
visually-hidden `<label>`; collapsible list groups set `aria-expanded`; drag and drop registers
a `KeyboardSensor`. Keep this level when adding UI.
