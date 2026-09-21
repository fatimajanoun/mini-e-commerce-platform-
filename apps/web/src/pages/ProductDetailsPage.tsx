import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getProductBySlug,
  type ProductDetails,
} from "../services/products";
import { addCartItem } from "../services/cart";
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
  const [addedToCart, setAddedToCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getProductBySlug(slug!);

        setProduct(data);

        if (data.variants.length > 0) {
          const firstAvailableVariant = data.variants.find(
            (variant) => variant.stock > 0,
          );

          setSelectedVariant(
            firstAvailableVariant?.id ?? data.variants[0].id,
          );
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

  const selectedVariantData = product.variants.find(
    (variant) => variant.id === selectedVariant,
  );

  const maxQuantity =
    product.variants.length > 0
      ? selectedVariantData?.stock ?? 0
      : product.stock ?? 0;

  const isOutOfStock = maxQuantity <= 0;

  const handleQuantityDecrease = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleQuantityIncrease = () => {
    setQuantity((current) =>
      Math.min(maxQuantity, current + 1),
    );
  };

  const handleVariantChange = (variantId: string) => {
    setSelectedVariant(variantId);
    setQuantity(1);
    setAddedToCart(false);
  };

  const handleAddToCart = async () => {
    if (
      addingToCart ||
      addedToCart ||
      isOutOfStock ||
      (product.variants.length > 0 && !selectedVariant)
    ) {
      return;
    }

    try {
      setAddingToCart(true);

      await addCartItem({
        productId: product.id,
        variantId: selectedVariant ?? undefined,
        quantity,
      });

      setAddedToCart(true);

      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to add product to cart:", err);
    } finally {
      setAddingToCart(false);
    }
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
            {isOutOfStock
              ? "Out of stock"
              : `${maxQuantity} available in stock`}
          </div>

          {product.variants.length > 0 && (
            <div className="product-details-options">
              <h3>Options</h3>

              <div className="product-options">
                {product.variants.map((variant) => {
                  const variantOutOfStock = variant.stock <= 0;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      className={`product-option ${
                        selectedVariant === variant.id
                          ? "selected"
                          : ""
                      } ${variantOutOfStock ? "out-of-stock" : ""}`}
                      onClick={() => {
                        if (variantOutOfStock) return;
                        handleVariantChange(variant.id);
                      }}
                      disabled={variantOutOfStock}
                    >
                      {variant.value}
                    </button>
                  );
                })}
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
                  disabled={quantity <= 1 || isOutOfStock}
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={handleQuantityIncrease}
                  disabled={
                    isOutOfStock ||
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
                className={`add-to-cart-button ${
                  addedToCart ? "added" : ""
                }`}
                disabled={
                  addingToCart ||
                  addedToCart ||
                  isOutOfStock
                }
                onClick={handleAddToCart}
              >
                {addingToCart
                  ? "Adding..."
                  : addedToCart
                    ? "✓ Added to Cart"
                    : isOutOfStock
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
