# Decisions and assumptions

## Assumptions (acceptance criteria left gaps)

1. **“Top rated”** means Fake Store `rating.rate` descending, then `rating.count`, then `id`. Home shows the top **5**.
2. **Category “top rated” + “additional”** means the top **3** by the same sort for that category, then the remaining products in that category.
3. **Search** matches case-insensitive substrings in `title` and `description`. Fake Store has no search endpoint, so filtering happens in our backend (with a short in-memory product cache).
4. **Search UX** uses an explicit Search button (not typeahead-only), matching the GIVEN/WHEN wording.
5. **Enquiry fields** are name, email, and message, with product id/title attached. Thank-you is a dedicated route after successful submit.
6. **Email delivery** in local/review environments uses MailHog SMTP. “Sales inbox receives an email” is verified in the MailHog UI (`:8025`).
7. **Currency** is shown as **INR** in the UI. Fake Store returns USD-like numbers; we convert with a fixed rate (₹83 = $1) for display only — the API still returns the source amount.

## Requirements simplified or dropped

| Item | Decision | Why |
|------|----------|-----|
| Auth / cart / checkout | Dropped | Outside MVP acceptance criteria; time-box |
| Production AWS deploy | Dropped for submission | Compose is enough for reviewers; adapters stay AWS-friendly (e.g. SES later) |
| Full E2E browser suite | Dropped | Unit/service tests cover critical path; E2E is a “next day” item |
| Heavy design system | Simplified | Brief notes look & feel will change; clean readable UI only |

## How this grows beyond the PoC

- **Product data source:** implement another `ProductSource` (Postgres, CMS, Shopify) in `infrastructure/`. `CatalogService` and routes stay the same.
- **Email provider:** implement another `EmailSender` (SES, SendGrid). Enquiry route unchanged.
- **Look and feel:** frontend-only; API DTOs stay stable.
- **Categories / merchandising:** move featured selection from “sort by rating” to curated IDs or rules without rewriting the UI contract (`GET /api/products/featured`).

## What I would do with another day

1. Playwright smoke test for home → product → enquiry → MailHog.
2. Stronger caching / stale-while-revalidate for Fake Store (or replace with a real catalog).
3. SES adapter + Terraform/CDK sketch for AWS.
4. Enquiry rate limiting and basic spam controls.
5. Richer empty/error states and accessibility pass.
