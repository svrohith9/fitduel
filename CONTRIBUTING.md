# Contributing to FitDuel

Thanks for wanting to help FitDuel get better. This guide covers the basics — it should take ~5 minutes to read and get you started.

## Ways to contribute

- 🐛 **Report a bug** — [open an issue](https://github.com/svrohith9/fitduel/issues/new?template=bug_report.yml)
- 💡 **Propose a feature** — [open a feature request](https://github.com/svrohith9/fitduel/issues/new?template=feature_request.yml)
- 🔧 **Fix a bug or ship a feature** — fork, branch, PR (see below)
- 📖 **Improve docs** — typos, clearer examples, better screenshots all welcome
- 🎨 **Design** — if you have an eye for UI, motion, or brand, open an issue with mockups

## Dev workflow

1. **Fork** the repo and clone your fork.
2. **Create a branch** off `main`:
   ```bash
   git checkout -b feat/streak-shields
   ```
   Prefix with `feat/`, `fix/`, `docs/`, `chore/`, or `refactor/`.
3. **Set up the app locally** — follow the [Quick start](README.md#-quick-start-local-dev) in the README. You'll need your own Supabase project (free tier is plenty).
4. **Run the app**:
   ```bash
   npm run dev
   ```
5. **Before opening a PR**, run:
   ```bash
   npm run build   # type-check + production build
   npm run lint    # ESLint
   ```
   Both must pass.
6. **Commit** with conventional-commit-ish messages:
   - `feat: add streak shield gifting`
   - `fix: handle empty duels on dashboard`
   - `docs: clarify supabase setup`
7. **Push** and **open a PR** against `main`. Fill out the PR template.

## Coding style

- **TypeScript strict** — no `any` unless there's a real reason.
- **Server components by default.** Mark a component `"use client"` only when it uses state, effects, or browser APIs.
- **Server actions** for mutations. Return `{ error }` for surfaceable errors; `redirect()` for success paths.
- **Data access only via `src/lib/supabase/queries.ts` and `actions.ts`** — don't call Supabase directly from pages.
- **One component per file.** Co-locate small pieces.
- **Tailwind utility-first.** Custom classes only in `globals.css` for shared patterns.
- **Animations** via `framer-motion` — keep them under 600 ms and honor `prefers-reduced-motion`.
- **No comments explaining what the code does** — only add a comment when the **why** is non-obvious.
- **Don't commit secrets.** `.env.local` is gitignored; use `.env.example` for the template.

## Database changes

- Add a file to `supabase/migrations/NNNN_<name>.sql`.
- Keep migrations **idempotent** (`create table if not exists`, `alter table ... add column if not exists`).
- Update `supabase/schema.sql` if you're adding a new table (so the "paste once" flow stays coherent).
- If you add a new table, add RLS policies in the same migration.

## UI changes

- Use the dark / flame-gradient / glass aesthetic that's already there — don't introduce new primitives without a reason.
- Every new interactive element should have hover, focus-visible, and active states.
- Test on **mobile widths** (≤ 400 px) — FitDuel is mobile-first.

## Reviewing

Maintainers will typically respond within a few days. PRs with clear descriptions, small diffs, and one concern per PR merge fastest.

## License

By contributing, you agree that your work will be licensed under the project's [MIT License](LICENSE).
