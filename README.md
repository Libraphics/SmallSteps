# SmallSteps

SmallSteps is a bilingual (English/Arabic) individual-only progress app that helps users move toward a high-level objective by generating one concrete next step at a time.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (dark/light theme)
- next-intl (`en`/`ar`, RTL for Arabic)
- Prisma + PostgreSQL
- NextAuth Credentials (email/password) + bcrypt hashing
- OpenAI API + Zod output validation

## Features delivered
- Individual-only auth and objective tracking (no team mode)
- Sign up (email, password, locale) and login
- Dashboard with onboarding and objective list/create
- Objective detail with:
  - Generate Next Step
  - Step card details + status actions (planned/done/skipped)
  - Duplicate and near-duplicate blocking
  - Progress counts
- Private mode objective option (redacted context to LLM)
- Rate limits (30/day per user, 10/hour per objective)
- Export per objective as Markdown and PDF endpoint
- Guest local storage schema helpers and conversion-ready structure
- Brand SVG assets:
  - `public/brand/smallsteps-icon.svg`
  - `public/brand/smallsteps-full.svg`

## Setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy env file
   ```bash
   cp .env.example .env
   ```
3. Run migrations
   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```
4. Seed demo data
   ```bash
   npm run prisma:seed
   ```
5. Start app
   ```bash
   npm run dev
   ```

## Demo account
- Email: `demo@smallsteps.app`
- Password: `Demo@12345`

## Deployment (online)
Recommended: Vercel + managed PostgreSQL (Neon/Supabase/RDS).

1. Push this repo to GitHub.
2. Import to Vercel.
3. Set environment variables from `.env.example`.
4. Configure `DATABASE_URL` to production Postgres.
5. Run `prisma migrate deploy` during build or as a post-deploy step.
6. Set `NEXTAUTH_URL` to your public domain.

## Notes
- No raw objective content is logged in production paths.
- Password reset email-link flow is allowed but requires SMTP provider wiring in auth/email service.
