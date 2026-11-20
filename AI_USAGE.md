# AI usage notes

## Tools and models

- Cursor (Composer)
- Agent notes: [AGENTS.md](AGENTS.md)

## Plan / spec used (step by step)

1. Choose stack: React + Node TypeScript.
2. Keep Fake Store behind the backend only.
3. Design swappable ports for product source and email.
4. Map features: home featured → category → search → product → enquire → thank you + email.
5. Plan backend layout: routes → services → ports ← infrastructure.
6. Plan frontend pages, API client, and colour theme (warm sand + forest green).
7. Plan local run: Docker Compose + MailHog + `.env.example`.
8. Plan tests for featured, category, search, enquiry.
9. Plan docs: simple glanceable README, DECISIONS, AI_USAGE.
10. Build in that order, then review.

## Key prompts

1. Give a start-to-end plan for the product catalogue MVP. No code yet.
2. Suggest a simple backend structure: routes → services → ports ← infrastructure.
3. Build the API: featured, category, search, product, enquiry. Wire Fake Store + SMTP.
4. Build the React UI: home, category, search, product + enquire, thank you. Prices in INR. Colour theme: warm sand + forest green.
5. Add Docker Compose, `.env.example`, DECISIONS. Make README simple so anyone can run it at a glance.
6. Add Vitest for featured, category, search, enquiry. Run and fix.

## Where AI got something wrong

- Drifted to jewelry-only; I kept scope generic.
- Import extensions broke typecheck; fixed after tests failed.

## Ownership

I architected it in a simple way: the browser talks to our Node API, and Node calls Fake Store. If Fake Store or email fails, the API returns a clear error response. I also designed the UI placement and colour theme (warm sand + forest green). I reviewed the flow, error handling, and ran the tests.
