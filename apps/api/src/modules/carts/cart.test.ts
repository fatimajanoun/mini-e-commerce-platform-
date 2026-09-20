import { describe, expect, it, vi } from "vitest";
import Fastify from "fastify";

import Cart from "../../db/models/Cart.js";
import CartItem from "../../db/models/CartItem.js";
import Product from "../../db/models/Product.js";
import Variant from "../../db/models/Variant.js";

import {
  addCartItem,
  updateCartItem,
  deleteCartItem,
} from "./cart.service.js";

import { cartRoutes } from "./cart.routes.js";

vi.mock("../../middleware/authenticate.js", () => ({
  authenticate: vi.fn(async (request: any) => {
    request.user = {
      userId: "user-1",
    };
  }),
}));

describe("cart service", () => {
  it("rejects adding more items than available stock", async () => {
    vi.spyOn(Product, "findByPk").mockResolvedValue({
      get: (field: string) => {
        if (field === "stock") return 5;
      },
    } as any);

    await expect(
      addCartItem("user-1", {
        productId: "product-1",
        quantity: 6,
      }),
    ).rejects.toThrow("Insufficient stock");

    vi.restoreAllMocks();
  });

  it("rejects a variant that does not belong to the product", async () => {
    vi.spyOn(Product, "findByPk").mockResolvedValue({
      get: (field: string) => {
        if (field === "stock") return null;
      },
    } as any);

    vi.spyOn(Variant, "findOne").mockResolvedValue(null);

    await expect(
      addCartItem("user-1", {
        productId: "product-1",
        variantId: "variant-from-another-product",
        quantity: 1,
      }),
    ).rejects.toThrow("Variant not found");

    vi.restoreAllMocks();
  });

  it("rejects updating quantity above available stock", async () => {
    vi.spyOn(Cart, "findOne").mockResolvedValue({
      get: (field: string) => {
        if (field === "id") return "cart-1";
      },
    } as any);

    vi.spyOn(CartItem, "findOne").mockResolvedValue({
      get: (field: string) => {
        if (field === "product_id") return "product-1";
        if (field === "variant_id") return null;
        if (field === "quantity") return 2;
      },
    } as any);

    vi.spyOn(Product, "findByPk").mockResolvedValue({
      get: (field: string) => {
        if (field === "stock") return 5;
      },
    } as any);

    await expect(
      updateCartItem("user-1", "cart-item-1", {
        quantity: 6,
      }),
    ).rejects.toThrow("Insufficient stock");

    vi.restoreAllMocks();
  });

  it("rejects changing to a variant from another product", async () => {
    vi.spyOn(Cart, "findOne").mockResolvedValue({
      get: (field: string) => {
        if (field === "id") return "cart-1";
      },
    } as any);

    vi.spyOn(CartItem, "findOne").mockResolvedValue({
      get: (field: string) => {
        if (field === "product_id") return "product-1";
        if (field === "variant_id") return null;
        if (field === "quantity") return 1;
      },
    } as any);

    vi.spyOn(Variant, "findOne").mockResolvedValue(null);

    await expect(
      updateCartItem("user-1", "cart-item-1", {
        variantId: "variant-from-another-product",
      }),
    ).rejects.toThrow("Variant not found");

    vi.restoreAllMocks();
  });

  it("rejects updating a cart item that does not belong to the user", async () => {
    vi.spyOn(Cart, "findOne").mockResolvedValue({
      get: (field: string) => {
        if (field === "id") return "user-cart-1";
      },
    } as any);

    vi.spyOn(CartItem, "findOne").mockResolvedValue(null);

    await expect(
      updateCartItem("user-1", "another-user-item", {
        quantity: 2,
      }),
    ).rejects.toThrow("Cart item not found");

    vi.restoreAllMocks();
  });

  it("rejects deleting a cart item that does not belong to the user", async () => {
    vi.spyOn(Cart, "findOne").mockResolvedValue({
      get: (field: string) => {
        if (field === "id") return "user-cart-1";
      },
    } as any);

    vi.spyOn(CartItem, "findOne").mockResolvedValue(null);

    await expect(
      deleteCartItem("user-1", "another-user-item"),
    ).rejects.toThrow("Cart item not found");

    vi.restoreAllMocks();
  });
});

describe("PATCH /cart/items/:id", () => {
  it("rejects an invalid quantity", async () => {
    const app = Fastify();

    await app.register(cartRoutes, {
      prefix: "/cart",
    });

    const response = await app.inject({
      method: "PATCH",
      url: "/cart/items/cart-item-1",
      payload: {
        quantity: 0,
      },
    });

    expect(response.statusCode).toBe(400);

    vi.restoreAllMocks();
  });

  it("rejects an invalid variant UUID", async () => {
    const app = Fastify();

    await app.register(cartRoutes, {
      prefix: "/cart",
    });

    const response = await app.inject({
      method: "PATCH",
      url: "/cart/items/cart-item-1",
      payload: {
        variantId: "invalid-id",
      },
    });

    expect(response.statusCode).toBe(400);

    vi.restoreAllMocks();
  });
});

describe("DELETE /cart/items/:id", () => {
  it("returns 404 when the cart item does not belong to the user", async () => {
    vi.spyOn(Cart, "findOne").mockResolvedValue({
      get: (field: string) => {
        if (field === "id") return "user-cart-1";
      },
    } as any);

    vi.spyOn(CartItem, "findOne").mockResolvedValue(null);

    const app = Fastify();

    await app.register(cartRoutes, {
      prefix: "/cart",
    });

    const response = await app.inject({
      method: "DELETE",
      url: "/cart/items/cart-item-from-another-user",
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      message: "Cart item not found",
    });

    vi.restoreAllMocks();
  });
});