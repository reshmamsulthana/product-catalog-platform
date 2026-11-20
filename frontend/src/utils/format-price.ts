/** Fake Store amounts are USD-like; show INR for this market. */
const USD_TO_INR = 83;

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatPrice(usdAmount: number): string {
  return inr.format(Math.round(usdAmount * USD_TO_INR));
}