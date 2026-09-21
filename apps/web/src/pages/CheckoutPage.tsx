import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCart } from "../services/cart";
import type { CartResponse } from "../services/cart";
import { createOrder } from "../services/order";

import "../styles/checkout.css";

const SHIPPING_FEE = 5;

export default function CheckoutPage() {
    const navigate = useNavigate();

    const [cart, setCart] = useState<CartResponse>({
        items: [],
        total: 0,
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
    });

    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await getCart();

                if (data.items.length === 0) {
                    navigate("/cart");
                    return;
                }

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

        fetchCart();
    }, [navigate]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            const result = await createOrder(form);

            setOrderId(result.order.id);
            setOrderConfirmed(true);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to place order",
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main className="checkout-page">
                <div className="checkout-container">
                    <p className="checkout-message">
                        Loading checkout...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <div className="checkout-container">
                <div className="checkout-header">
                    <h1>Checkout</h1>
                    <p>Complete your information to place your order.</p>
                </div>

                <div className="checkout-content">
                    <form
                        className="checkout-form"
                        onSubmit={handleSubmit}
                    >
                        <section className="checkout-section">
                            <h2>Delivery Information</h2>

                            <div className="checkout-fields">
                                <label>
                                    Name
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        required
                                    />
                                </label>

                                <label>
                                    Phone
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="Your phone number"
                                        required
                                    />
                                </label>

                                <label>
                                    Address
                                    <input
                                        type="text"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="Street, building..."
                                        required
                                    />
                                </label>

                                <label>
                                    City
                                    <input
                                        type="text"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="Your city"
                                        required
                                    />
                                </label>
                            </div>
                        </section>

                        {error && (
                            <p className="checkout-error">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="place-order-button"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Placing Order..."
                                : "Place Order"}
                        </button>
                    </form>

                    <aside className="checkout-summary">
                        <h2>Order Summary</h2>

                        <div className="checkout-items">
                            {cart.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="checkout-item"
                                >
                                    <div>
                                        <h3>{item.product.title}</h3>

                                        {item.variant && (
                                            <p>
                                                {item.variant.name}:{" "}
                                                {item.variant.value}
                                            </p>
                                        )}

                                        <span>
                                            Quantity: {item.quantity}
                                        </span>
                                    </div>

                                    <strong>
                                        ${item.subtotal.toFixed(2)}
                                    </strong>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-totals">
                            <div>
                                <span>Subtotal</span>
                                <span>
                                    ${cart.total.toFixed(2)}
                                </span>
                            </div>

                            <div>
                                <span>Shipping</span>
                                <span>
                                    ${SHIPPING_FEE.toFixed(2)}
                                </span>
                            </div>

                            <div className="checkout-total">
                                <span>Total</span>
                                <span>
                                    $
                                    {(
                                        cart.total +
                                        SHIPPING_FEE
                                    ).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {orderConfirmed && (
                <div className="order-confirmation-overlay">
                    <div className="order-confirmation-modal">
                        <div className="confirmation-check">
                            <svg
                                viewBox="0 0 52 52"
                                aria-hidden="true"
                            >
                                <circle
                                    className="confirmation-circle"
                                    cx="26"
                                    cy="26"
                                    r="24"
                                    fill="none"
                                />
                                <path
                                    className="confirmation-tick"
                                    fill="none"
                                    d="M14 27l8 8 16-18"
                                />
                            </svg>
                        </div>

                        <h2>Order Confirmed!</h2>

                        <p>
                            Your order has been placed
                            successfully.
                        </p>

                        <span className="confirmation-order-id">
                            Order #{orderId.slice(0, 8)}
                        </span>

                        <button
                            type="button"
                            onClick={() => navigate("/home")}
                            className="confirmation-button"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}