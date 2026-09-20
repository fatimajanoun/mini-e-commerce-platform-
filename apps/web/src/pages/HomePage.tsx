import { useEffect, useState } from "react";
import heroPerfume from "../assets/hero-home.png";
import ProductGrid from "../components/products/ProductGrid";
import {
    getProducts,
    type Product,
    type ProductPagination,
} from "../services/products";

import "../styles/home.css";

function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] =
        useState<ProductPagination | null>(null);

    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const limit = 8;

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                setError("");

                const result = await getProducts(page, limit);

                setProducts(result.data);
                setPagination(result.pagination);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load products",
                );
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [page]);

    const goToPreviousPage = () => {
        if (page > 1) {
            setPage((currentPage) => currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (
            pagination &&
            page < pagination.totalPages
        ) {
            setPage((currentPage) => currentPage + 1);
        }
    };

    return (
        <main className="home-page">
            <section
                className="hero-section"
                style={{
                    backgroundImage: `url(${heroPerfume})`,
                }}
            >
                <div className="hero-overlay" />

                <div className="hero-content">
                    <p className="hero-eyebrow">
                        THE ART OF FRAGRANCE
                    </p>

                    <h1>
                        Discover
                        <br />
                        Your Signature Scent
                    </h1>

                    <p className="hero-description">
                        Exquisite fragrances, thoughtfully crafted
                        <br />
                        to become part of your story.
                    </p>

                    <button
                        className="hero-button"
                        onClick={() =>
                            document
                                .getElementById("collection")
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                })
                        }
                    >
                        Explore Collection
                    </button>
                </div>
            </section>

            <section className="brand-values">
                <div className="value">
                    <div>
                        <h3>Exceptional Craftsmanship</h3>
                        <p>
                            Carefully composed fragrances crafted
                            with refined ingredients and attention to detail.
                        </p>
                    </div>
                </div>

                <div className="value">
                    <div>
                        <h3>Long-Lasting Elegance</h3>
                        <p>
                            Sophisticated scents created to linger
                            beautifully throughout the day.
                        </p>
                    </div>
                </div>

                <div className="value">
                    <div>
                        <h3>Your Signature Scent</h3>
                        <p>
                            Distinctive fragrances designed to express
                            your personality and leave an impression.
                        </p>
                    </div>
                </div>
            </section>

            <section
                id="collection"
                className="products-section"
            >
                <div className="products-header">
                    <div>
                        <p className="section-eyebrow">
                            OUR FRAGRANCES
                        </p>

                        <h2>Find Your Signature</h2>

                        <p>
                            Explore a curated collection of distinctive
                            scents, crafted for every expression.
                        </p>
                    </div>
                </div>

                {loading && (
                    <p className="products-status">
                        Loading collection...
                    </p>
                )}

                {!loading && error && (
                    <p className="products-error">
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <>
                        <ProductGrid products={products} />

                        {pagination &&
                            pagination.totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={page === 1}
                                    >
                                        Previous
                                    </button>

                                    <span>
                                        {pagination.page} /{" "}
                                        {pagination.totalPages}
                                    </span>

                                    <button
                                        onClick={goToNextPage}
                                        disabled={
                                            page ===
                                            pagination.totalPages
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                    </>
                )}
            </section>
        </main>
    );
}

export default HomePage;