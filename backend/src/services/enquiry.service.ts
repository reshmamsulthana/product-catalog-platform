import type { EmailSender } from "../ports/email-sender.js";
import type { ProductSource } from "../ports/product-source.js";
import type { EnquiryInput } from "../types/enquiry.js";

export class EnquiryService {
  constructor(
    private readonly productSource: ProductSource,
    private readonly emailSender: EmailSender,
  ) {}

  async submit(input: EnquiryInput): Promise<void> {
    const product = await this.productSource.getById(input.productId);
    if (!product) {
      throw new NotFoundError(`Product ${input.productId} not found`);
    }

    await this.emailSender.sendEnquiry({
      ...input,
      productTitle: input.productTitle ?? product.title,
    });
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}