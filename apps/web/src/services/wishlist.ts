import type { ProductImage } from "./products";

const API_URL = "http://localhost:3000";

export interface WishlistVariant {
  id: string;
  name: string;
  value: string;
  price: number | null;
  stock: number;
}

export interface WishlistProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  stock: number | null;
  image: ProductImage | null;
  variants: WishlistVariant[];
}

export interface WishlistItem {
  id: string;
  product: WishlistProduct;
}

export interface Wishlist {
  items: WishlistItem[];
}

export async function getWishlist(): Promise<Wishlist> {
  const response = await fetch(`${API_URL}/wishlist`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch wishlist",
    );
  }

  return result;
}

export async function addToWishlist(
  productId: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/wishlist/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      productId,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to add product to wishlist",
    );
  }
}

export async function removeFromWishlist(
  itemId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/wishlist/items/${itemId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to remove product from wishlist",
    );
  }
}