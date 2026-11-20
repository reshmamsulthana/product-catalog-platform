import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  initialQuery?: string;
};

export function SearchBar({ initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <input
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products"
        aria-label="Search products"
      />
      <button className="btn" type="submit">
        Search
      </button>
    </form>
  );
}