import { useState } from "react";
import type { CartItem as CartItemType } from "../../services/cart";
import {
    deleteCartItem,
    updateCartItem,
} from "../../services/cart";
import "../../styles/cartItem.css";
import { Trash2 } from "lucide-react";

interface CartItemProps {
    item: CartItemType;
    onUpdate: () => void;
    onRemove: () => void;
}

export default function CartItem({
    item,
    onUpdate,
    onRemove,
}: CartItemProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const decreaseQuantity = async () => {
        if (item.quantity <= 1) return;

        try {
            setLoading(true);
            setError("");

            await updateCartItem(
                item.id,
                item.quantity - 1,
                item.variant?.id,
            );

            onUpdate();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update quantity",
            );
        } finally {
            setLoading(false);
        }
    };

    const increaseQuantity = async () => {
        try {
            setLoading(true);
            setError("");

            await updateCartItem(
                item.id,
                item.quantity + 1,
                item.variant?.id,
            );

            onUpdate();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update quantity",
            );
        } finally {
            setLoading(false);
        }
    };

    const changeVariant = async (variantId: string) => {
        if (variantId === item.variant?.id) return;

        try {
            setLoading(true);
            setError("");

            await updateCartItem(
                item.id,
                item.quantity,
                variantId,
            );

            onUpdate();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to change variant",
            );
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async () => {
        try {
            setLoading(true);
            setError("");

            await deleteCartItem(item.id);

            onRemove();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to remove item",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <article className="cart-item">
            <div className="cart-item-image">
                {item.product.image ? (
                    <img
                        src={item.product.image.url}
                        alt={item.product.title}
                    />
                ) : (
                    <span>No image</span>
                )}
            </div>

            <div className="cart-item-content">
                <div className="cart-item-main">
                    <div className="cart-item-details">
                        <p className="cart-item-eyebrow">
                            Product
                        </p>

                        <h3>{item.product.title}</h3>

                        <p className="cart-item-price">
                            ${item.unit_price.toFixed(2)}
                        </p>

                        {item.product.variants.length > 0 && (
                            <div className="cart-item-variants">
                                <span className="cart-item-variant-label">
                                    {item.product.variants[0].name}
                                </span>

                                <div className="cart-variant-options">
                                    {item.product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            type="button"
                                            className={
                                                item.variant?.id === variant.id
                                                    ? "cart-variant-option active"
                                                    : "cart-variant-option"
                                            }
                                            onClick={() =>
                                                changeVariant(variant.id)
                                            }
                                            disabled={
                                                loading || variant.stock <= 0
                                            }
                                        >
                                            {variant.value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {error && (
                            <p className="cart-item-error">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="cart-item-right">
                        <div className="cart-quantity">
                            <button
                                type="button"
                                onClick={decreaseQuantity}
                                disabled={
                                    loading || item.quantity <= 1
                                }
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>

                            <span>{item.quantity}</span>

                            <button
                                type="button"
                                onClick={increaseQuantity}
                                disabled={loading}
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>

                        <div className="cart-item-subtotal">
                            ${item.subtotal.toFixed(2)}
                        </div>

                        <button
                            type="button"
                            className="cart-remove"
                            onClick={removeItem}
                            disabled={loading}
                            aria-label={`Remove ${item.product.title} from cart`}
                            title="Remove item"
                        >
                            <Trash2 size={17} strokeWidth={1.6} />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}