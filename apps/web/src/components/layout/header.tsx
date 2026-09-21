import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/header.css";

export default function Header() {
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
          </Link>

          <Link
            to="/cart"
            className="site-header-icon"
            aria-label="Cart"
          >
            <ShoppingBag size={21} strokeWidth={1.5} />
          </Link>
        </nav>
      </div>
    </header>
  );
}

