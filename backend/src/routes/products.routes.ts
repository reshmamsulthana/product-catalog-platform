import { Router } from "express";
import type { CatalogService } from "../services/catalog.service.js";

export function createProductsRouter(catalog: CatalogService): Router {
  const router = Router();

  router.get("/featured", async (_req, res, next) => {
    try {
      const products = await catalog.getFeatured();
      res.json(products);
    } catch (err) {
      next(err);
    }
  });

  router.get("/search", async (req, res, next) => {
    try {
      const q = typeof req.query.q === "string" ? req.query.q : "";
      const products = await catalog.search(q);
      res.json(products);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: "Invalid product id" });
        return;
      }
      const product = await catalog.getById(id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.json(product);
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export function createCategoriesRouter(catalog: CatalogService): Router {
  const router = Router();

  router.get("/", async (_req, res, next) => {
    try {
      const categories = await catalog.getCategories();
      res.json(categories);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:name", async (req, res, next) => {
    try {
      const name = decodeURIComponent(req.params.name);
      const result = await catalog.getCategoryProducts(name);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
}