import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CategoryPage } from "./pages/CategoryPage";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { SearchPage } from "./pages/SearchPage";
import { ThankYouPage } from "./pages/ThankYouPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="category/:name" element={<CategoryPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="products/:id" element={<ProductPage />} />
          <Route path="thank-you" element={<ThankYouPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}