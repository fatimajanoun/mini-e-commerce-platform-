import { Link } from "react-router-dom";
import "../../styles/footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-container">
        <Link to="/home" className="site-footer-logo">
          NAMOU
        </Link>

        <p className="site-footer-description">
          A curated perfumery platform for discovering exceptional fragrances.
        </p>

        <p className="site-footer-copyright">
          © 2026 Namou. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
