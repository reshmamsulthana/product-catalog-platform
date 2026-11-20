import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  fakeStoreBaseUrl: required(
    "FAKE_STORE_BASE_URL",
    "https://fakestoreapi.com",
  ).replace(/\/$/, ""),
  corsOrigin: required("CORS_ORIGIN", "http://localhost:5173"),
  salesInbox: required("SALES_INBOX", "sales@example.com"),
  smtpHost: required("SMTP_HOST", "localhost"),
  smtpPort: Number(process.env.SMTP_PORT ?? 1025),
  smtpFrom: required("SMTP_FROM", "catalogue@example.com"),
};