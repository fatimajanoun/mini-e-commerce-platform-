export interface CartVariant {
  id: string;
  name: string;
  value: string;
  price: number | null;
  stock: number;
}

export interface CartProduct {
  id: string;
  title: string;
  price: number;

  image: {
    id: string;
    url: string;
  } | null;

  variants: CartVariant[];
}

export interface CartItem {
  id: string;
  product: CartProduct;
  variant: {
    id: string;
    name: string;
    value: string;
    price: number | null;
  } | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

const API_URL = "http://localhost:3000";

export async function getCart(): Promise<CartResponse> {
  const response = await fetch(`${API_URL}/cart`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch cart",
    );
  }

  return result;
}

export async function addCartItem(data: {
  productId: string;
  variantId?: string;
  quantity: number;
}): Promise<void> {
  const response = await fetch(`${API_URL}/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to add item to cart",
    );
  }
}

export async function updateCartItem(
  itemId: string,
  quantity: number,
  variantId?: string | null,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/cart/items/${itemId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        quantity,
        variantId,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update cart item",
    );
  }
}

export async function deleteCartItem(
  itemId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/cart/items/${itemId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to remove cart item",
    );
  }
}