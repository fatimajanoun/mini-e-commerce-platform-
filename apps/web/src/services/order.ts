export interface CreateOrderData {
    name: string;
    phone: string;
    address: string;
    city: string;
}

export interface OrderItem {
    product_id: string;
    variant_id: string | null;
    product_title: string;
    variant_name: string | null;
    unit_price: number;
    quantity: number;
    subtotal: number;
}

export interface Order {
    id: string;
    status: string;
    items: OrderItem[];
    subtotal: number;
    shipping_fee: number;
    total_amount: number;
    name: string;
    phone: string;
    address: string;
    city: string;
    created_at?: string;
}

export interface CreateOrderResponse {
    message: string;
    order: Order;
}

const API_URL = "http://localhost:3000";

export async function createOrder(
    data: CreateOrderData,
): Promise<CreateOrderResponse> {
    const response = await fetch(`${API_URL}/order`, {
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
            result.message || "Failed to place order",
        );
    }

    return result;
}