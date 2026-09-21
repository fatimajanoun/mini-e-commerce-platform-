import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import {
    getWishlist,
    removeFromWishlist,
    type WishlistItem,
} from "../services/wishlist";

import { addCartItem } from "../services/cart";

import "../styles/wishList.css";

function WishlistPage() {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [removingId, setRemovingId] = useState<string | null>(null);

    const [addingToCartId, setAddingToCartId] = useState<string | null>(
        null,
    );

    const [addedToCartId, setAddedToCartId] = useState<string | null>(
        null,
    );

    const [selectedVariants, setSelectedVariants] = useState<
        Record<string, string>
    >({});

    useEffect(() => {
        async function loadWishlist() {
            try {
                setLoading(true);
                setError("");

                const wishlist = await getWishlist();

                setItems(wishlist.items);

                const initialVariants: Record<string, string> = {};

                wishlist.items.forEach((item) => {
                    if (item.product.variants.length > 0) {
                        const firstAvailableVariant =
                            item.product.variants.find(
                                (variant) => variant.stock > 0,
                            );

                        initialVariants[item.id] =
                            firstAvailableVariant?.id ??
                            item.product.variants[0].id;
                    }
                });

                setSelectedVariants(initialVariants);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load wishlist",
                );
            } finally {
                setLoading(false);
            }
        }

        loadWishlist();
    }, []);
    
    async function handleRemove(itemId: string) {
        try {
            setRemovingId(itemId);
            setError("");

            await removeFromWishlist(itemId);

            setItems((currentItems) =>
                currentItems.filter((item) => item.id !== itemId),
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to remove product",
            );
        } finally {
            setRemovingId(null);
        }
    }

    function handleVariantSelect(
        itemId: string,
        variantId: string,
    ) {
        setSelectedVariants((current) => ({
            ...current,
            [itemId]: variantId,
        }));

        setAddedToCartId(null);
    }

    async function handleAddToCart(item: WishlistItem) {
        const product = item.product;

        const selectedVariantId = selectedVariants[item.id];

        if (
            product.variants.length > 0 &&
            !selectedVariantId
        ) {
            setError("Please select a variant first.");
            return;
        }

        const selectedVariantData = product.variants.find(
            (variant) => variant.id === selectedVariantId,
        );

        const maxQuantity =
            product.variants.length > 0
                ? selectedVariantData?.stock ?? 0
                : product.stock ?? 0;

        const isOutOfStock = maxQuantity <= 0;

        if (isOutOfStock) {
            return;
        }

        try {
            setAddingToCartId(item.id);
            setError("");

            await addCartItem({
                productId: product.id,
                variantId: selectedVariantId,
                quantity: 1,
            });

            setAddedToCartId(item.id);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to add product to cart",
            );
        } finally {
            setAddingToCartId(null);
        }
    }

    if (loading) {
        return (
            <main className="wishlist-page">
                <div className="wishlist-container">
                    <h1 className="wishlist-title">
                        My Wishlist
                    </h1>

                    <div className="wishlist-loading">
                        Loading your wishlist...
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="wishlist-page">
            <div className="wishlist-container">
                <div className="wishlist-header">
                    <div>
                        <p className="wishlist-eyebrow">
                            Saved items
                        </p>

                        <h1 className="wishlist-title">
                            My Wishlist
                        </h1>
                    </div>

                    {items.length > 0 && (
                        <span className="wishlist-count">
                            {items.length}{" "}
                            {items.length === 1 ? "item" : "items"}
                        </span>
                    )}
                </div>

                {error && (
                    <div className="wishlist-error">
                        {error}
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="wishlist-empty">
                        <div className="wishlist-empty-icon">
                            ♡
                        </div>

                        <h2>Your wishlist is empty</h2>

                        <p>
                            Save products you love and come back to
                            them anytime.
                        </p>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {items.map((item) => {
                            const product = item.product;

                            const selectedVariantId =
                                selectedVariants[item.id];

                            const selectedVariantData =
                                product.variants.find(
                                    (variant) =>
                                        variant.id === selectedVariantId,
                                );

                            const maxQuantity =
                                product.variants.length > 0
                                    ? selectedVariantData?.stock ?? 0
                                    : product.stock ?? 0;

                            const isOutOfStock =
                                maxQuantity <= 0;

                            const hasVariants =
                                product.variants.length > 0;

                            const added =
                                addedToCartId === item.id;

                            const adding =
                                addingToCartId === item.id;

                            return (
                                <article
                                    key={item.id}
                                    className="wishlist-card"
                                >
                                    <div className="wishlist-image-wrapper">
                                        {product.image ? (
                                            <img
                                                src={product.image.url}
                                                alt={product.title}
                                                className="wishlist-image"
                                            />
                                        ) : (
                                            <div className="wishlist-image-placeholder">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    <div className="wishlist-card-content">
                                        <div className="wishlist-product-header">
                                            <h2 className="wishlist-product-title">
                                                {product.title}
                                            </h2>

                                            <button
                                                type="button"
                                                className="product-wishlist-button"
                                                onClick={() =>
                                                    handleRemove(item.id)
                                                }
                                                disabled={
                                                    removingId === item.id
                                                }
                                                aria-label={`Remove ${product.title} from wishlist`}
                                            >
                                                <Heart
                                                    size={18}
                                                    strokeWidth={1.5}
                                                    fill="currentColor"
                                                />
                                            </button>
                                        </div>

                                        <p className="wishlist-product-price">
                                            $
                                            {selectedVariantData?.price ??
                                                product.price}
                                        </p>

                                        {hasVariants && (
                                            <div className="wishlist-variants">
                                                {product.variants.map(
                                                    (variant) => (
                                                        <button
                                                            key={variant.id}
                                                            type="button"
                                                            className={`wishlist-variant-button ${selectedVariantId ===
                                                                    variant.id
                                                                    ? "selected"
                                                                    : ""
                                                                } ${variant.stock <= 0
                                                                    ? "disabled"
                                                                    : ""
                                                                }`}
                                                            onClick={() =>
                                                                handleVariantSelect(
                                                                    item.id,
                                                                    variant.id,
                                                                )
                                                            }
                                                            disabled={
                                                                variant.stock <= 0
                                                            }
                                                        >
                                                            {variant.value}
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        )}

                                        <div className="wishlist-card-actions">
                                            <button
                                                type="button"
                                                className={`wishlist-cart-button ${added ? "added" : ""
                                                    } ${isOutOfStock
                                                        ? "out-of-stock"
                                                        : ""
                                                    }`}
                                                onClick={() =>
                                                    handleAddToCart(item)
                                                }
                                                disabled={
                                                    adding ||
                                                    isOutOfStock ||
                                                    (hasVariants &&
                                                        !selectedVariantId)
                                                }
                                            >
                                                {adding
                                                    ? "Adding..."
                                                    : added
                                                        ? "Added to Cart"
                                                        : isOutOfStock
                                                            ? "Out of Stock"
                                                            : hasVariants &&
                                                                !selectedVariantId
                                                                ? "Select Variant"
                                                                : "Add to Cart"}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}

export default WishlistPage;