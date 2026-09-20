import { describe, expect, it, vi } from "vitest";
import Fastify from "fastify";

import Product from "../../db/models/Product.js";
import { getProductBySlug, getProducts } from "./product.service.js";
import { productRoutes } from "./product.routes.js";


vi.mock("../../middleware/authenticate.js", () => ({
  authenticate: vi.fn(async () => {}),
}));

describe("product service", () => {
  it("returns paginated products", async () => {
    vi.spyOn(Product, "findAndCountAll").mockResolvedValue({
      count: 15,
      rows: [
        {
          toJSON: () => ({
            id: "product-1",
            slug: "classic-t-shirt",
            title: "Classic T-Shirt",
            price: "25.00",

            images: [
              {
                id: "image-1",
                image_url: "https://example.com/tshirt.jpg",
              },
            ],

            variants: [
              {
                id: "variant-1",
                name: "Color",
                value: "White",
              },
            ],
          }),
        },
      ],
    } as any);

    const result = await getProducts({
      page: 1,
      limit: 10,
    });

    expect(result.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 15,
      totalPages: 2,
    });

    expect(result.data[0]).toEqual({
      id: "product-1",
      slug: "classic-t-shirt",
      title: "Classic T-Shirt",
      price: "25.00",

      image: {
        id: "image-1",
        url: "https://example.com/tshirt.jpg",
      },

      variants: [
        {
          id: "variant-1",
          name: "Color",
          value: "White",
        },
      ],
    });

    vi.restoreAllMocks();
  });
});

describe("GET /products", () => {
  it("returns paginated products", async () => {
    vi.spyOn(Product, "findAndCountAll").mockResolvedValue({
      count: 15,
      rows: [
        {
          toJSON: () => ({
            id: "product-1",
            slug: "classic-t-shirt",
            title: "Classic T-Shirt",
            price: "25.00",
            images: [],
            variants: [],
          }),
        },
      ],
    } as any);

    const app = Fastify();

    await app.register(productRoutes, {
      prefix: "/products",
    });

    const response = await app.inject({
      method: "GET",
      url: "/products?page=1&limit=10",
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toEqual({
      data: [
        {
          id: "product-1",
          slug: "classic-t-shirt",
          title: "Classic T-Shirt",
          price: "25.00",
          image: null,
          variants: [],
        },
      ],

      pagination: {
        page: 1,
        limit: 10,
        total: 15,
        totalPages: 2,
      },
    });

    vi.restoreAllMocks();
  });

  it("uses default pagination values", async () => {
    const findAndCountAll = vi
      .spyOn(Product, "findAndCountAll")
      .mockResolvedValue({
        count: 15,
        rows: [],
      } as any);

    const app = Fastify();

    await app.register(productRoutes, {
      prefix: "/products",
    });

    const response = await app.inject({
      method: "GET",
      url: "/products",
    });

    expect(response.statusCode).toBe(200);

    expect(findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 10,
        offset: 0,
      }),
    );

    vi.restoreAllMocks();
  });

  it("rejects invalid pagination values", async () => {
    const app = Fastify();

    await app.register(productRoutes, {
      prefix: "/products",
    });

    const response = await app.inject({
      method: "GET",
      url: "/products?page=0&limit=10",
    });

    expect(response.statusCode).toBe(400);
  });

describe("getProductBySlug", () => {
  it("returns a product by slug", async () => {
    vi.spyOn(Product, "findOne").mockResolvedValue({
      toJSON: () => ({
        id: "product-1",
        slug: "classic-t-shirt",
        title: "Classic T-Shirt",
        description: "A classic cotton t-shirt",
        price: "25.00",
        stock: 10,
        images: [
          {
            id: "image-1",
            image_url: "https://example.com/tshirt.jpg",
            is_primary: true,
          },
        ],
        variants: [
          {
            id: "variant-1",
            name: "Color",
            value: "White",
            price: "25.00",
            stock: 5,
            images: [
              {
                id: "variant-image-1",
                image_url: "https://example.com/white-tshirt.jpg",
                is_primary: true,
              },
            ],
          },
        ],
      }),
    } as any);

    const result = await getProductBySlug("classic-t-shirt");

    expect(result.toJSON()).toEqual({
      id: "product-1",
      slug: "classic-t-shirt",
      title: "Classic T-Shirt",
      description: "A classic cotton t-shirt",
      price: "25.00",
      stock: 10,
      images: [
        {
          id: "image-1",
          image_url: "https://example.com/tshirt.jpg",
          is_primary: true,
        },
      ],
      variants: [
        {
          id: "variant-1",
          name: "Color",
          value: "White",
          price: "25.00",
          stock: 5,
          images: [
            {
              id: "variant-image-1",
              image_url: "https://example.com/white-tshirt.jpg",
              is_primary: true,
            },
          ],
        },
      ],
    });

    expect(Product.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          slug: "classic-t-shirt",
        },
      }),
    );

    vi.restoreAllMocks();
  });

  it("throws an error when the product does not exist", async () => {
    vi.spyOn(Product, "findOne").mockResolvedValue(null);

    await expect(
      getProductBySlug("non-existent-product"),
    ).rejects.toThrow("Product not found");

    vi.restoreAllMocks();
  });
});

describe("GET /products/:slug", () => {
  it("returns a product by slug", async () => {
    vi.spyOn(Product, "findOne").mockResolvedValue({
      toJSON: () => ({
        id: "product-1",
        slug: "classic-t-shirt",
        title: "Classic T-Shirt",
        description: "A classic cotton t-shirt",
        price: "25.00",
        stock: 10,
        images: [],
        variants: [],
      }),
    } as any);

    const app = Fastify();

    await app.register(productRoutes, {
      prefix: "/products",
    });

    const response = await app.inject({
      method: "GET",
      url: "/products/classic-t-shirt",
    });

    expect(response.statusCode).toBe(200);

    vi.restoreAllMocks();
  });
});

});
