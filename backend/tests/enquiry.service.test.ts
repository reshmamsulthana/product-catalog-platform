import { describe, expect, it, vi } from "vitest";
import type { EmailSender } from "../src/ports/email-sender.js";
import type { ProductSource } from "../src/ports/product-source.js";
import {
  EnquiryService,
  NotFoundError,
} from "../src/services/enquiry.service.js";
import type { Product } from "../src/types/product.js";

const product: Product = {
  id: 7,
  title: "White Gold Ring",
  price: 9.99,
  description: "A ring",
  category: "jewelery",
  image: "https://example.com/ring.png",
  rating: { rate: 3, count: 40 },
};

describe("EnquiryService", () => {
  it("sends email with product title when product exists", async () => {
    const productSource: ProductSource = {
      getAll: async () => [product],
      getById: async (id) => (id === 7 ? product : null),
      getCategories: async () => ["jewelery"],
      getByCategory: async () => [product],
    };
    const sendEnquiry = vi.fn(async () => undefined);
    const emailSender: EmailSender = { sendEnquiry };

    const service = new EnquiryService(productSource, emailSender);
    await service.submit({
      name: "Ada",
      email: "ada@example.com",
      message: "Interested",
      productId: 7,
    });

    expect(sendEnquiry).toHaveBeenCalledWith({
      name: "Ada",
      email: "ada@example.com",
      message: "Interested",
      productId: 7,
      productTitle: "White Gold Ring",
    });
  });

  it("throws NotFoundError for unknown product", async () => {
    const productSource: ProductSource = {
      getAll: async () => [],
      getById: async () => null,
      getCategories: async () => [],
      getByCategory: async () => [],
    };
    const emailSender: EmailSender = {
      sendEnquiry: vi.fn(async () => undefined),
    };
    const service = new EnquiryService(productSource, emailSender);

    await expect(
      service.submit({
        name: "Ada",
        email: "ada@example.com",
        message: "Hi",
        productId: 99,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});