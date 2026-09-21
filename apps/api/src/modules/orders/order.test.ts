import { describe, expect, it, vi } from "vitest";
import Fastify from "fastify";

import * as orderService from "./order.service.js";
import { orderRoutes } from "../orders/order.route.js";

vi.mock("../../middleware/authenticate.js", () => ({
  authenticate: vi.fn(async (request: any) => {
    request.user = {
      userId: "user-1",
      email: "test@example.com",
    };
  }),
}));

describe("POST /order", () => {
  it("rejects missing name", async () => {
    const app = Fastify();

    await app.register(orderRoutes, {
      prefix: "/order",
    });

    const response = await app.inject({
      method: "POST",
      url: "/order",
      payload: {
        phone: "70123456",
        address: "Main Street",
        city: "Beirut",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("rejects missing phone", async () => {
    const app = Fastify();

    await app.register(orderRoutes, {
      prefix: "/order",
    });

    const response = await app.inject({
      method: "POST",
      url: "/order",
      payload: {
        name: "Fatima Jannoun",
        address: "Main Street",
        city: "Beirut",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("rejects missing address", async () => {
    const app = Fastify();

    await app.register(orderRoutes, {
      prefix: "/order",
    });

    const response = await app.inject({
      method: "POST",
      url: "/order",
      payload: {
        name: "Fatima Jannoun",
        phone: "70123456",
        city: "Beirut",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("rejects missing city", async () => {
    const app = Fastify();

    await app.register(orderRoutes, {
      prefix: "/order",
    });

    const response = await app.inject({
      method: "POST",
      url: "/order",
      payload: {
        name: "Fatima Jannoun",
        phone: "70123456",
        address: "Main Street",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("returns 400 when the cart is empty", async () => {
    const createOrderMock = vi
      .spyOn(orderService, "createOrder")
      .mockRejectedValue(
        new Error("Cart is empty"),
      );

    const app = Fastify();

    await app.register(orderRoutes, {
      prefix: "/order",
    });

    const response = await app.inject({
      method: "POST",
      url: "/order",
      payload: {
        name: "Fatima Jannoun",
        phone: "70123456",
        address: "Main Street",
        city: "Beirut",
      },
    });

    expect(response.statusCode).toBe(400);

    expect(response.json()).toEqual({
      message: "Cart is empty",
    });

    createOrderMock.mockRestore();
  });

  it("returns 400 when the cart does not exist", async () => {
    const createOrderMock = vi
      .spyOn(orderService, "createOrder")
      .mockRejectedValue(
        new Error("Cart not found"),
      );

    const app = Fastify();

    await app.register(orderRoutes, {
      prefix: "/order",
    });

    const response = await app.inject({
      method: "POST",
      url: "/order",
      payload: {
        name: "Fatima Jannoun",
        phone: "70123456",
        address: "Main Street",
        city: "Beirut",
      },
    });

    expect(response.statusCode).toBe(400);

    expect(response.json()).toEqual({
      message: "Cart not found",
    });

    createOrderMock.mockRestore();
  });

  it("returns 500 when placing the order fails unexpectedly", async () => {
    const createOrderMock = vi
      .spyOn(orderService, "createOrder")
      .mockRejectedValue(
        new Error("Database error"),
      );

    const app = Fastify();

    await app.register(orderRoutes, {
      prefix: "/order",
    });

    const response = await app.inject({
      method: "POST",
      url: "/order",
      payload: {
        name: "Fatima Jannoun",
        phone: "70123456",
        address: "Main Street",
        city: "Beirut",
      },
    });

    expect(response.statusCode).toBe(500);

    expect(response.json()).toEqual({
      message: "Database error",
    });

    createOrderMock.mockRestore();
  });
});