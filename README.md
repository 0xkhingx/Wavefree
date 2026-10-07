# Wavefree — debt payoff companion

A mobile app to monitor debt and repay it strategically: track balances across debts, log income, and get an AI-suggested allocation for each paycheck.

## Features

- **Debt tracking** — balances, minimum payments, urgency levels, due dates (`debts` table in Supabase)
- **AI allocation** — Claude suggests how to split a payment across debts (`src/services/claude.ts`)
- **Visual payoff** — SVG donut chart, currency numpad input, floating pill tab nav
- **Profile + history** — income entries and payoff progress per user (Supabase Auth)

## Tech stack

Expo Router (~56) + React Native, TypeScript, Supabase (Auth + Postgres), Claude API for allocation suggestions.

## Repo layout

`src/app/` (expo-router routes: `(tabs)`, `debts`, `add-debt`, `profile`) · `src/components/` · `src/services/` (`supabase.ts`, `claude.ts`) · `src/contexts|hooks|constants|types/` · `supabase-schema.sql` (run in the Supabase SQL editor).

## Run it locally

Requires Node 20+ and the [Expo Go](https://expo.dev/go) app (or an emulator).

```bash
npm ci
cp .env.example .env   # then fill in EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY
npx expo start         # scan the QR code with Expo Go
```

Run `supabase-schema.sql` in your Supabase project's SQL editor first — it creates the `debts` and `income_entries` tables.

## Status

Working app (debt management, AI allocation, charts, profile screens), pre-store. No TestFlight/Play release yet.

## License

MIT — see [LICENSE](LICENSE).
