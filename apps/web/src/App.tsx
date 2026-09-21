import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import MainLayout from "./components/layout/MainLayout";
import WishlistPage from "./pages/wishlistPage";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route
              path="/products/:slug"
              element={<ProductDetailsPage />}
            />
            <Route
              path="/cart"
              element={<CartPage />}
            />
            <Route
              path="/wishlist"
              element={<WishlistPage />}
            />
            <Route
              path="/checkout"
              element={<CheckoutPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;