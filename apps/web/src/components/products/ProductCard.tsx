import type { Product } from "../../services/products";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card-image">
        {product.image ? (
          <img
            src={product.image.url}
            alt={product.title}
          />
        ) : (
          <div className="product-image-placeholder">
            No image
          </div>
        )}
      </div>

      <div className="product-card-content">
        <h3>{product.title}</h3>

        <p className="product-price">
          ${product.price}
        </p>

        {product.variants.length > 0 && (
          <div className="product-variants">
            {product.variants.map((variant) => (
              <span
                key={variant.id}
                className="product-variant"
              >
                {variant.name}: {variant.value}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default ProductCard;