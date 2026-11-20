import nodemailer from "nodemailer";
import type { EmailSender } from "../ports/email-sender.js";
import type { EnquiryInput } from "../types/enquiry.js";

export class SmtpEmailSender implements EmailSender {
  private readonly transporter;

  constructor(
    private readonly options: {
      host: string;
      port: number;
      from: string;
      salesInbox: string;
    },
  ) {
    this.transporter = nodemailer.createTransport({
      host: options.host,
      port: options.port,
      secure: false,
      tls: { rejectUnauthorized: false },
    });
  }

  async sendEnquiry(
    enquiry: EnquiryInput & { productTitle: string },
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.options.from,
        to: this.options.salesInbox,
        replyTo: enquiry.email,
        subject: `Enquiry: ${enquiry.productTitle} (#${enquiry.productId})`,
        text: [
          `New product enquiry`,
          ``,
          `Product: ${enquiry.productTitle} (id ${enquiry.productId})`,
          `Name: ${enquiry.name}`,
          `Email: ${enquiry.email}`,
          ``,
          `Message:`,
          enquiry.message,
        ].join("\n"),
      });
    } catch (err) {
      const detail = err instanceof Error ? err.message : "unknown error";
      throw new EmailSendError(`Failed to send enquiry email: ${detail}`);
    }
  }
}

export class EmailSendError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailSendError";
  }
}