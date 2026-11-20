import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Valid email is required"),
  message: z.string().trim().min(1, "Message is required").max(2000),
  productId: z.coerce.number().int().positive(),
  productTitle: z.string().trim().max(300).optional(),
});

export function validateEnquiry(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = enquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }
  req.body = parsed.data;
  next();
}