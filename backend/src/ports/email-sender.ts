import type { EnquiryInput } from "../types/enquiry.js";

/** Swappable so MailHog / SES / SendGrid can change later. */
export interface EmailSender {
  sendEnquiry(enquiry: EnquiryInput & { productTitle: string }): Promise<void>;
}