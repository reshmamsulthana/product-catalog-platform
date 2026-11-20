import type { NextFunction, Request, Response } from "express";
import { UpstreamError } from "../infrastructure/fake-store.product-source.js";
import { EmailSendError } from "../infrastructure/smtp.email-sender.js";
import { NotFoundError } from "../services/enquiry.service.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
    return;
  }

  if (err instanceof UpstreamError) {
    res.status(502).json({ error: "Upstream product source unavailable" });
    return;
  }

  if (err instanceof EmailSendError) {
    res.status(502).json({
      error:
        "Could not deliver enquiry email. Is MailHog (SMTP) running locally?",
    });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}