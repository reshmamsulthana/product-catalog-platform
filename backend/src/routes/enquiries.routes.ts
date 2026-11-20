import { Router } from "express";
import { validateEnquiry } from "../middleware/validate.js";
import type { EnquiryService } from "../services/enquiry.service.js";

export function createEnquiriesRouter(enquiryService: EnquiryService): Router {
  const router = Router();

  router.post("/", validateEnquiry, async (req, res, next) => {
    try {
      await enquiryService.submit(req.body);
      res.status(201).json({ ok: true, message: "Enquiry sent" });
    } catch (err) {
      next(err);
    }
  });

  return router;
}