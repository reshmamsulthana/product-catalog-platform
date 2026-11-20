# Product Catalogue

A simple product catalogue app.

Customers can:

1. See top-rated products on the home page  
2. Browse by category  
3. Search for a product  
4. Open a product and send an enquiry  

Built with **React** (frontend) and **Node.js** (backend).  
Product data comes from the Fake Store API through our backend only.  
Enquiry emails go to a local inbox (MailDev or MailHog).

---

## How to run

Pick **one** option.

### Option A — without Docker

You only need **Node.js 20+**.

Open 3 terminals in this folder:

**Terminal 1 — email inbox**

```bash
npx --yes maildev --smtp 1025 --web 8025
```

**Terminal 2 — backend**

```bash
cd backend
cp ../.env.example .env
npm install
npm run dev
```

**Terminal 3 — frontend**

```bash
cd frontend
npm install
npm run dev
```

### Option B — with Docker

You need **Docker Desktop** open and running.

```bash
docker compose up --build
```

To stop:

```bash
docker compose down
```

---

## Open these links

| What | Link |
|------|------|
| App | http://localhost:5173 |
| API check | http://localhost:3001/api/health |
| Enquiry emails | http://localhost:8025 |

---

## How to test

```bash
cd backend
npm test
```

---

## What this project uses

| Part | Choice | Why |
|------|--------|-----|
| Frontend | React + TypeScript | Easy to run and change |
| Backend | Node.js + TypeScript | Small and clear API |
| Products | Fake Store via backend | Allowed for this PoC |
| Email | MailDev / MailHog | Free, no paid account |

Simple flow:

```text
Browser → React UI → our API → Fake Store (products)
                              → SMTP inbox (enquiry email)
```

More detail: [FLOW.md](FLOW.md)

---

## Config

Use [`.env.example`](.env.example).  
Do not commit real secrets.  
Reviewers do not need any paid services.

---

## Other docs

| File | What it is |
|------|------------|
| [FLOW.md](FLOW.md) | How the app works |
| [DECISIONS.md](DECISIONS.md) | Assumptions and trade-offs |
| [AI_USAGE.md](AI_USAGE.md) | How AI was used |
| [AGENTS.md](AGENTS.md) | Notes for AI agents |

---

## Time spent

| Phase | Time |
|-------|------|
| Planning | ~45 min |
| Building | ~2 h |
| Testing / review | ~30 min |
| **Total** | **~3.25 h** |
