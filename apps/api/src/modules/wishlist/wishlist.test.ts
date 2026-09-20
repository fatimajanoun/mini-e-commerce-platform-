import { describe, expect, it, vi } from "vitest";
import Fastify from "fastify";

import Wishlist from "../../db/models/Wishlist.js";
import WishlistItem from "../../db/models/WishlistItem.js";
import Product from "../../db/models/Product.js";

import {
  getWishlist,
  addWishlistItem,
  deleteWishlistItem,
} from "./wishlist.service.js";

import { wishlistRoutes } from "./wishlist.routes.js";

vi.mock("../../middleware/authenticate.js", () => ({
  authenticate: vi.fn(async (request: any) => {
    request.user = {
      userId: "user-1",
    };
  }),
}));

describe("wishlist service", () => {
  it("rejects adding a product that does not exist", async () => {
    vi.spyOn(Product, "findByPk").mockResolvedValue(null);

    await expect(
      addWishlistItem("user-1", "non-existent-product"),
    ).rejects.toThrow("Product not found");

    vi.restoreAllMocks();
  });

  it("rejects adding a product that is already in the wishlist", async () => {
    vi.spyOn(Product, "findByPk").mockResolvedValue({
      get: vi.fn(),
    } as any);

    vi.spyOn(Wishlist, "findOne").mockResolvedValue({
      get: (field: string) => {
        if (field === "id") return "wishlist-1";
      },
    } as any);

    vi.spyOn(WishlistItem, "findOne").mockResolvedValue({
      get: vi.fn(),
    } as any);

    await expect(
      addWishlistItem("user-1", "product-1"),
    ).rejects.toThrow(
      "Product already in wishlist",
    );

    vi.restoreAllMocks();
  });

  it("rejects deleting a wishlist item that does not belong to the user", async () => {
    vi.spyOn(Wishlist, "findOne").mockResolvedValue({
      get: (field: string) => {
        if (field === "id") return "user-wishlist-1";
      },
    } as any);

    vi.spyOn(WishlistItem, "findOne").mockResolvedValue(null);

    await expect(
      deleteWishlistItem(
        "user-1",
        "another-user-item",
      ),
    ).rejects.toThrow("Wishlist item not found");

    vi.restoreAllMocks();
  });

  it("returns an empty wishlist when the user has no wishlist", async () => {
    vi.spyOn(Wishlist, "findOne").mockResolvedValue(null);

    const result = await getWishlist("user-1");

    expect(result).toEqual({
      items: [],
    });

    vi.restoreAllMocks();
  });
});

describe("POST /wishlist/items", () => {
  it("returns 404 when the product does not exist", async () => {
    vi.spyOn(Product, "findByPk").mockResolvedValue(null);

    const app = Fastify();

    await app.register(wishlistRoutes, {
      prefix: "/wishlist",
    });

    const response = await app.inject({
      method: "POST",
      url: "/wishlist/items",
      payload: {
        productId: "non-existent-product",
      },
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      message: "Product not found",
    });

    vi.restoreAllMocks();
  });

  it("returns 409 when the product is already in the wishlist", async () => {
    vi.spyOn(Product, "findByPk").mockResolvedValue({
      get: vi.fn(),
    } as any);

    vi.spyOn(Wishlist, "findOne").mockResolvedValue({
      get: (field: string) => {
        if (field === "id") return "wishlist-1";
      },
    } as any);

    vi.spyOn(WishlistItem, "findOne").mockResolvedValue({
      get: vi.fn(),
    } as any);

    const app = Fastify();

    await app.register(wishlistRoutes, {
      prefix: "/wishlist",
    });

    const response = await app.inject({
      method: "POST",
      url: "/wishlist/items",
      payload: {
        productId: "product-1",
      },
    });

    expect(response.statusCode).toBe(409);

    expect(response.json()).toEqual({
      message: "Product already in wishlist",
    });

    vi.restoreAllMocks();
  });
});

describe("DELETE /wishlist/items/:id", () => {
  it("returns 404 when the wishlist item does not belong to the user", async () => {
    vi.spyOn(Wishlist, "findOne").mockResolvedValue({
      get: (field: string) => {
        if (field === "id") return "user-wishlist-1";
      },
    } as any);

    vi.spyOn(WishlistItem, "findOne").mockResolvedValue(null);

    const app = Fastify();

    await app.register(wishlistRoutes, {
      prefix: "/wishlist",
    });

    const response = await app.inject({
      method: "DELETE",
      url: "/wishlist/items/another-user-item",
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toEqual({
      message: "Wishlist item not found",
    });

    vi.restoreAllMocks();
  });
});