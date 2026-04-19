# Security Policy

## Reporting a vulnerability

**Please do not file public issues for security vulnerabilities.**

Instead, open a [GitHub private vulnerability report](https://github.com/svrohith9/fitduel/security/advisories/new) or email the maintainers directly.

When reporting, please include:

- A clear description of the issue
- Steps to reproduce
- The affected version or commit
- Potential impact (who / what is at risk)

We aim to respond within **48 hours** and will coordinate a fix + disclosure with you.

## Supported versions

FitDuel is actively developed. The `main` branch receives all security fixes. Tagged releases prior to 1.0 are not individually patched — please upgrade to `main` or the latest release.

## Scope

In-scope:

- Any code in this repository
- Supabase RLS policies in `supabase/schema.sql`
- Deployment configuration (`proxy.ts`, `next.config.*`, Vercel settings)

Out-of-scope:

- Issues in upstream dependencies (Next.js, Supabase SDK) — please report those to their respective projects
- Social engineering / phishing against the live demo
- DoS against the free-tier live demo

## Security model — TL;DR

- **Row-Level Security** is the primary boundary. The publishable (anon) key is public.
- **Server actions** run with the user's JWT, not the service_role key.
- **Email and password** are handled entirely by Supabase Auth.
- **Invite codes** are unguessable random strings — the only way to join a duel is via its link.

See [`supabase/schema.sql`](supabase/schema.sql) for every policy.
