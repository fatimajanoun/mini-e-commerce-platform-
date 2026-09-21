import { Heart, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/header.css";
import { useEffect, useState } from "react";
import { getWishlist } from "../../services/wishlist";
import { getCart } from "../../services/cart";

export default function Header() {
  const location = useLocation();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

     useEffect(() => {
        async function loadCounts() {
            try {
                const [wishlist, cart] = await Promise.all([
                    getWishlist(),
                    getCart(),
                ]);

                setWishlistCount(wishlist.items.length);
                setCartCount(cart.items.length);
            } catch {
                setWishlistCount(0);
                setCartCount(0);
            }
        }

        loadCounts();
    }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="site-header-container">
        <Link to="/home" className="site-logo">
          NAMOU
        </Link>

        <nav className="site-header-actions">
          <Link
            to="/wishlist"
            className="site-header-icon"
            aria-label="Wishlist"
          >
            <Heart size={21} strokeWidth={1.5} />

            {wishlistCount > 0 && (
              <span className="icon-badge">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="site-header-icon"
            aria-label="Cart"
          >
            <ShoppingBag size={21} strokeWidth={1.5} />

            {cartCount > 0 && (
              <span className="icon-badge">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

