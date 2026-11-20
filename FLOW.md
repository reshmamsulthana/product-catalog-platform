# How the product catalogue works

Short explanation of the plan and runtime flow. Use this in the interview walkthrough.

## 1. Big picture

Customer uses the React app. The app never talks to Fake Store. Everything goes through our API. Product data and email are behind ports so they can be swapped later.

```mermaid
flowchart LR
  User[Customer] --> UI[React UI]
  UI --> API[Express API]
  API --> Catalog[CatalogService]
  API --> Enquiry[EnquiryService]
  Catalog --> ProductPort[ProductSource port]
  Enquiry --> ProductPort
  Enquiry --> EmailPort[EmailSender port]
  ProductPort --> FakeStore[FakeStore adapter]
  EmailPort --> Smtp[SMTP MailHog adapter]
  FakeStore --> External[fakestoreapi.com]
  Smtp --> Inbox[Sales inbox in MailHog]
```

**One line:** UI → API → services → ports ← infrastructure.

## 2. Customer journey (pages)

```mermaid
flowchart TD
  Home[Home: 5 top-rated products] --> Category[Category: top rated + others]
  Home --> Search[Search: type term + click Search]
  Home --> Product[Product detail]
  Category --> Product
  Search --> Product
  Product --> Enquire[Enquire form]
  Enquire --> Thanks[Thank you page]
  Enquire --> Email[Email to sales inbox]
```

## 3. Product read flow

Example: home featured products.

```mermaid
sequenceDiagram
  participant Browser
  participant API as Express /api
  participant Service as CatalogService
  participant Port as ProductSource
  participant FS as Fake Store

  Browser->>API: GET /api/products/featured
  API->>Service: getFeatured()
  Service->>Port: getAll()
  Port->>FS: GET /products
  FS-->>Port: products JSON
  Port-->>Service: Product[]
  Service-->>API: top 5 by rating
  API-->>Browser: JSON featured list
```

Same pattern for:

| UI action | API |
|-----------|-----|
| Open home | `GET /api/products/featured` |
| Click category | `GET /api/categories/:name` |
| Click Search | `GET /api/products/search?q=` |
| Open product tile | `GET /api/products/:id` |
| Load nav categories | `GET /api/categories` |

## 4. Enquiry flow

```mermaid
sequenceDiagram
  participant Browser
  participant API as Express /api
  participant Service as EnquiryService
  participant Products as ProductSource
  participant Mail as EmailSender
  participant Hog as MailHog

  Browser->>API: POST /api/enquiries
  API->>API: validate name email message productId
  API->>Service: submit(enquiry)
  Service->>Products: getById(productId)
  Products-->>Service: product or not found
  Service->>Mail: sendEnquiry(...)
  Mail->>Hog: SMTP email
  Hog-->>Mail: accepted
  Service-->>API: ok
  API-->>Browser: 201
  Browser->>Browser: go to /thank-you
```

## 5. Backend folders (why this shape)

```mermaid
flowchart TB
  routes[routes: HTTP only]
  services[services: business rules]
  ports[ports: contracts]
  infra[infrastructure: Fake Store + SMTP]

  routes --> services
  services --> ports
  infra -.->|implements| ports
```

| Folder | Job |
|--------|-----|
| `routes/` | Request in, JSON out |
| `services/` | Featured sort, category split, search, enquiry rules |
| `ports/` | Interfaces only |
| `infrastructure/` | Fake Store + Nodemailer today; DB/SES later |

## 6. Local run pieces

```mermaid
flowchart LR
  FE[frontend :5173] --> API[api :3001]
  API --> MH[mailhog SMTP :1025]
  User[Reviewer] --> FE
  User --> MHUI[MailHog UI :8025]
```

- App: http://localhost:5173  
- API: http://localhost:3001  
- Enquiry inbox: http://localhost:8025  

## 7. What changes later (growth story)

| Change | Touch |
|--------|--------|
| New product DB/CMS | New file in `infrastructure/`, same `ProductSource` |
| SES / SendGrid | New `EmailSender` implementation |
| New look & feel | Frontend CSS/tokens only |
| Featured = curated IDs | `CatalogService` only |
