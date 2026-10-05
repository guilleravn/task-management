# Git workflow

## Branches

Changes flow in one direction: `feat/*` (and other work branches) → `develop` → `main`.

- **`develop`** is the integration branch. Every work branch is created from `develop` and
  merged back into `develop` through a PR.
- **`main`** only receives `develop`, once everything planned is in `develop`. That merge is a
  release step done by the user — never open or merge a PR into `main` on your own.
- Work happens on a short-lived branch named by intent: `feat/<thing>`, `fix/<thing>`,
  `docs/<thing>`, `refactor/<thing>`, `chore/<thing>`. One branch and one PR per slice.
- Branch from an **up-to-date** `develop`: `git fetch` first and fast-forward local `develop` to
  `origin/develop` before branching.
- Once a work branch is merged, it can be deleted locally.

## Plan before you build

Anything non-trivial goes through plan mode first and the plan is approved before code is
written. Trivial means: typo, copy change, a one-line fix whose scope is obvious.

A plan names the slices it will be delivered in (see below), the files each slice touches, and
which invariants in [../rules/frontend-invariants.md](../rules/frontend-invariants.md) are
involved.

## What a slice is here

A slice is the **smallest change that leaves the app working and is reviewable on its own**.
In this frontend that is usually a vertical cut through one feature, not a horizontal layer:

- a new field end-to-end: `types.ts` + the GraphQL documents that select it + the components
  that render or edit it;
- a new filter: URL param handling in `BoardToolbar` and `Board` + the picker + the query
  variable;
- a new shared UI primitive in `components/ui/` together with its first usage;
- a pure refactor with no behavior change;
- a docs change.

Don't split one feature into "types commit / queries commit / components commit" — each of those
alone would leave the build or the UI inconsistent. Don't bundle unrelated features together
either.

Each slice must pass `npm run build` and `npm run lint` before it's committed.

## Commits

- **One commit per slice**, made when the slice is done — not one big commit at the end.
- Message format follows the existing history (Conventional Commits):
  `feat: …`, `fix: …`, `docs: …`, `refactor: …`, `chore: …`. Imperative, lowercase after the
  prefix, in English. Add a body when the *why* isn't obvious from the subject.
- **Show the full commit message in the chat and wait for approval before running
  `git commit`.**
- **No tool attribution**: no `Co-Authored-By`, no "Generated with", no similar trailers.
- Never commit `.env` or real customer data.

## Pushing

**Never `git push`** unless the user explicitly asks for it at that moment. Approval to commit is
not approval to push, and approval to push once is not approval to push again later.
