import { Router } from "express";
import type { CatalogService } from "../services/catalog.service.js";
import type { EnquiryService } from "../services/enquiry.service.js";
import { createEnquiriesRouter } from "./enquiries.routes.js";
import {
  createCategoriesRouter,
  createProductsRouter,
} from "./products.routes.js";

export function createApiRouter(
  catalog: CatalogService,
  enquiryService: EnquiryService,
): Router {
  const router = Router();
  router.use("/products", createProductsRouter(catalog));
  router.use("/categories", createCategoriesRouter(catalog));
  router.use("/enquiries", createEnquiriesRouter(enquiryService));
  router.get("/health", (_req, res) => {
    res.json({ ok: true });
  });
  return router;
}