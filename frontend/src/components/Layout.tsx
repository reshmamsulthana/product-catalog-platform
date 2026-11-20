import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { api } from "../api/client";
import { SearchBar } from "./SearchBar";

export function Layout() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    api
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            Product Catalogue
          </Link>
          <nav className="nav" aria-label="Categories">
            {categories.map((category) => (
              <NavLink
                key={category}
                to={`/category/${encodeURIComponent(category)}`}
              >
                {category}
              </NavLink>
            ))}
          </nav>
          <SearchBar />
        </div>
      </header>
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="site-footer">
        <div className="container">
          Browse products and send an enquiry — data via our API.
        </div>
      </footer>
    </>
  );
}