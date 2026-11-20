import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { Product } from "../types";

type Props = {
  product: Product;
};

export function EnquiryForm({ product }: Props) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.submitEnquiry({
        name,
        email,
        message,
        productId: product.id,
        productTitle: product.title,
      });
      navigate("/thank-you", { state: { productTitle: product.title } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send enquiry");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <h3>Enquire about this product</h3>
      <label>
        Name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </label>
      <label>
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>
      <label>
        Message
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      {error ? <p className="status error">{error}</p> : null}
      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Enquire"}
      </button>
    </form>
  );
}