# Changelog

All notable changes to FitDuel are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.3.0] — 2026-04-19

### Added
- **Weight unit toggle** — kg or lbs across every input and display. DB stays in kg; conversion happens in the UI + server actions.
- **Profile unit preference** — persisted in `profiles.preferred_unit`.
- **Shared WeightInput component** with inline unit switch.

### Changed
- Onboarding now has a single top-level unit toggle that drives both weight fields.

## [0.2.0] — 2026-04-19

### Added
- **Real Supabase auth** — signup, login, logout via server actions.
- **Auth trigger** (`handle_new_user`) auto-creates a `profiles` row when a new `auth.users` row is inserted.
- **Create-duel flow** with invite code generation.
- **`/invite/[code]` page** — accept an invite, or sign up → auto-join.
- **Leaderboard** calculated from real weigh-ins.
- **Log today** sheet for steps, active minutes, and weight.
- **Setup page** shown when Supabase env vars are missing, with step-by-step instructions.
- **Fallback profile creation** in `getCurrentProfile()` — if the trigger isn't installed, the profile row is created on the fly.

### Removed
- All mock data. Every page fetches from Supabase.

## [0.1.0] — 2026-04-19

### Added
- Initial scaffolding: Next.js 16, Tailwind v4, Framer Motion, Supabase SSR.
- Polished landing page with hero, features, device-sync section.
- Dashboard shell with tab bar: Home, Duels, Progress, Group, Profile.
- PWA manifest — installable on iOS and Android.
- Design system: flame-gradient accent, glass cards, spring animations.
