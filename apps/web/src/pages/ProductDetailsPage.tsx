import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getProductBySlug,
  type ProductDetails,
} from "../services/products";
import "../styles/product-details.css";

function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    null,
  );

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!slug) return;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getProductBySlug(slug!);

        setProduct(data);

        if (data.variants.length > 0) {
          setSelectedVariant(data.variants[0].id);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load product",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <main className="product-details-page">
        <p>Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-details-page">
        <p>{error || "Product not found"}</p>

        <Link to="/home" className="product-details-back">
          ← Back to collection
        </Link>
      </main>
    );
  }

  const maxQuantity = product.stock ?? 0;

  const handleQuantityDecrease = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleQuantityIncrease = () => {
    setQuantity((current) =>
      Math.min(maxQuantity, current + 1),
    );
  };

  const handleAddToCart = () => {
    console.log("Add to cart:", {
      productId: product.id,
      variantId: selectedVariant,
      quantity,
    });
  };

  const handleAddToWishlist = () => {
    console.log("Add to wishlist:", product.id);
  };

  return (
    <main className="product-details-page">
      <Link to="/home" className="product-details-back">
        ← Back to collection
      </Link>

      <section className="product-details">
        <div className="product-details-image">
          {product.images.length > 0 ? (
            <img
              src={product.images[0].url}
              alt={product.title}
            />
          ) : (
            <div className="product-image-placeholder">
              No image
            </div>
          )}
        </div>

        <div className="product-details-content">
          <p className="section-eyebrow">
            NAMOU FRAGRANCE
          </p>

          <h1>{product.title}</h1>

          <p className="product-details-price">
            ${product.price}
          </p>

          <p className="product-details-description">
            {product.description}
          </p>

          <div className="product-details-stock">
            {maxQuantity > 0
              ? `${maxQuantity} available in stock`
              : "Out of stock"}
          </div>

          {product.variants.length > 0 && (
            <div className="product-details-options">
              <h3>Options</h3>

              <div className="product-options">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    className={`product-option ${
                      selectedVariant === variant.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedVariant(variant.id);
                      setQuantity(1);
                    }}
                  >
                    {variant.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-details-purchase">
            <div className="quantity-section">
              <span className="quantity-label">
                Quantity
              </span>

              <div className="quantity-control">
                <button
                  type="button"
                  onClick={handleQuantityDecrease}
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={handleQuantityIncrease}
                  disabled={
                    maxQuantity === 0 ||
                    quantity >= maxQuantity
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="product-actions">
              <button
                type="button"
                className="add-to-cart-button"
                disabled={maxQuantity === 0}
                onClick={handleAddToCart}
              >
                {maxQuantity === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>

              <button
                type="button"
                className="add-to-wishlist-button"
                onClick={handleAddToWishlist}
              >
                ♡ Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetailsPage;