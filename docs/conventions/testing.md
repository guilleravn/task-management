# Testing

## Current state

**No test runner is configured yet.**

- `package.json` has no `test` script.
- No Vitest, Jest, Testing Library, Playwright or Cypress dependency is installed.
- There are no test files in `src/`.

The only automated checks are:

| Command | Catches |
| --- | --- |
| `npm run build` (`tsc -b && vite build`) | Type errors, unused locals/params, broken imports, build failures |
| `npm run lint` | `any`, `@ts-ignore`, Rules of Hooks / React Compiler violations, unused vars |

Run both before calling a change done. Behavior that isn't covered by types has to be checked
manually in the running app (`npm run dev`).

## Deciding on a test setup

Choosing a runner and writing test conventions is an open decision for the user. Don't add a
test runner, test dependencies or test conventions without asking first.

When that decision is made, this file will describe the runner, the command, and what is
expected to be tested.
