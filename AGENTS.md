# Agent notes for this repo

## Scope

- This is a product catalogue MVP for the AI-Native Engineer challenge.
- Prefer small, explainable changes over large refactors.
- Focus on the critical path: home featured (top 5) → category → search → product → enquiry → thank you.
- Do not add auth, cart, checkout, payments, or CMS unless explicitly asked.

## Architecture

- Keep product data access behind `ProductSource` and email behind `EmailSender`.
- Put real integrations in `backend/src/infrastructure/` only.
- Business rules live in `backend/src/services/`.
- Routes stay thin: parse request → call service → return JSON.
- Do not call Fake Store from the React client; all product data goes through `/api`.
- Frontend talks only to our backend (`frontend/src/api/client.ts`).

## Stack

- Client: React + TypeScript (Vite)
- Backend: Node.js + TypeScript (Express)
- Local email: MailHog / SMTP via Nodemailer
- Local run: Docker Compose when possible

## Product behaviour

- Featured = top 5 by Fake Store `rating.rate` (then count, then id).
- Category page = top rated in category + remaining products.
- Search = case-insensitive match on title + description (server-side).
- Enquiry needs name, email, message + product id; then thank-you page.
- UI prices display in INR (fixed conversion in `format-price.ts`).

## UI

- Colour theme: warm sand + forest green (`frontend/src/index.css` tokens).
- Keep UI clean and readable; look & feel should stay easy to swap later.
- Fonts: Fraunces (headings), DM Sans (body).

## Quality

- Validate enquiry input; return clear 400 / 404 / 502 errors.
- No secrets in git; use `.env.example`.
- No paid services or accounts required for reviewers.
- Keep comments rare; explain “why”, not “what”.
- Prefer clear names over comments.

## Testing & docs

- Cover critical path with Vitest: featured, category split, search, enquiry.
- Keep README runnable in under ~10 minutes (`docker compose up`).
- Update DECISIONS.md when assumptions or cuts change.
- Update AI_USAGE.md when important prompts or AI mistakes are worth recording.
