import { useState } from "react";
import { Check, Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../../services/products";
import { addCartItem } from "../../services/cart";
import "../../styles/ProductCard.css";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const firstAvailableVariant = product.variants.find(
    (variant) => variant.stock > 0,
  );

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    firstAvailableVariant?.id ?? product.variants[0]?.id ?? null,
  );

  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedVariant = product.variants.find(
    (variant) => variant.id === selectedVariantId,
  );

  const currentStock =
    product.variants.length > 0
      ? selectedVariant?.stock ?? 0
      : product.stock ?? 0;

  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = async () => {
    if (
      loading ||
      addedToCart ||
      isOutOfStock ||
      (product.variants.length > 0 && !selectedVariantId)
    ) {
      return;
    }

    try {
      setLoading(true);

      await addCartItem({
        productId: product.id,
        variantId: selectedVariantId ?? undefined,
        quantity: 1,
      });

      setAddedToCart(true);

      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-card-link">
        <div className="product-card-image">
          {product.image ? (
            <img src={product.image.url} alt={product.title} />
          ) : (
            <div className="product-image-placeholder">No image</div>
          )}
        </div>

        <div className="product-card-content">
          <h3>{product.title}</h3>

          <p className="product-price">${product.price}</p>

          {product.variants.length > 0 && (
            <div className="product-variants">
              {product.variants.map((variant) => {
                const variantOutOfStock = variant.stock <= 0;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    className={`product-variant ${
                      selectedVariantId === variant.id ? "selected" : ""
                    } ${variantOutOfStock ? "out-of-stock" : ""}`}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      if (variantOutOfStock) {
                        return;
                      }

                      setSelectedVariantId(variant.id);
                    }}
                    disabled={variantOutOfStock}
                  >
                    {variant.name}: {variant.value}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Link>

      <div className="product-card-actions">
        <button
          type="button"
          className="product-wishlist-button"
          aria-label={`Add ${product.title} to wishlist`}
        >
          <Heart size={18} strokeWidth={1.5} />
        </button>

        <button
          type="button"
          className={`product-cart-button ${
            addedToCart ? "added" : ""
          } ${isOutOfStock ? "out-of-stock" : ""}`}
          onClick={handleAddToCart}
          disabled={loading || addedToCart || isOutOfStock}
        >
          {loading ? (
            "Adding..."
          ) : addedToCart ? (
            <>
              <Check size={15} strokeWidth={2} />
              Added To Cart
            </>
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : (
            <>
              Add to cart
            </>
          )}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
