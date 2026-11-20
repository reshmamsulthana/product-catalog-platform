import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { FakeStoreProductSource } from "./infrastructure/fake-store.product-source.js";
import { SmtpEmailSender } from "./infrastructure/smtp.email-sender.js";
import { errorHandler } from "./middleware/error-handler.js";
import { createApiRouter } from "./routes/index.js";
import { CatalogService } from "./services/catalog.service.js";
import { EnquiryService } from "./services/enquiry.service.js";

export function createApp() {
  const productSource = new FakeStoreProductSource(env.fakeStoreBaseUrl);
  const emailSender = new SmtpEmailSender({
    host: env.smtpHost,
    port: env.smtpPort,
    from: env.smtpFrom,
    salesInbox: env.salesInbox,
  });

  const catalog = new CatalogService(productSource);
  const enquiryService = new EnquiryService(productSource, emailSender);

  const app = express();
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: "32kb" }));
  app.use("/api", createApiRouter(catalog, enquiryService));
  app.use(errorHandler);
  return app;
}