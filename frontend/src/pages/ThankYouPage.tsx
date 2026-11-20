import { Link, useLocation } from "react-router-dom";

type LocationState = {
  productTitle?: string;
};

export function ThankYouPage() {
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  return (
    <section className="hero">
      <h1>Thank you</h1>
      <p>
        {state.productTitle
          ? `Your enquiry about “${state.productTitle}” was sent to our sales team.`
          : "Your enquiry was sent to our sales team."}
      </p>
      <p>We will get back to you shortly.</p>
      <Link className="btn btn-secondary" to="/">
        Back to home
      </Link>
    </section>
  );
}