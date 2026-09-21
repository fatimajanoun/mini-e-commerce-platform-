import { useEffect, useState } from "react";
import CartItem from "../components/cart/cartItem";
import { getCart } from "../services/cart";
import type { CartResponse } from "../services/cart";
import "../styles/cartPage.css";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const navigate = useNavigate();

    const [cart, setCart] = useState<CartResponse>({
        items: [],
        total: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCart = async () => {
        try {
            setError("");

            const data = await getCart();
            setCart(data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load cart",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    if (loading) {
        return (
            <main className="cart-page">
                <div className="cart-container">
                    <p className="cart-message">Loading cart...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="cart-page">
                <div className="cart-container">
                    <p className="cart-error">{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <h1>Your Cart</h1>
                    <span>
                        {cart.items.length}{" "}
                        {cart.items.length === 1 ? "item" : "items"}
                    </span>
                </div>

                {cart.items.length === 0 ? (
                    <div className="cart-empty">
                        <h2>Your cart is empty</h2>
                        <p>
                            Browse our products and add something you like.
                        </p>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {cart.items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdate={fetchCart}
                                    onRemove={fetchCart}
                                />
                            ))}
                        </div>

                        <aside className="cart-summary">

                            <div className="cart-summary-row">
                                <span>Subtotal</span>
                                <span>${cart.total.toFixed(2)}</span>
                            </div>

                            <p className="cart-shipping-note">
                                Shipping is calculated at checkout.
                            </p>

                            <button
                                type="button"
                                className="cart-checkout-button"
                                onClick={() => navigate("/checkout")}
                            >
                                Checkout
                            </button>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
}