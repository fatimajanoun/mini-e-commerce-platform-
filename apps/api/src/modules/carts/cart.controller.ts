import { FastifyReply, FastifyRequest } from "fastify";

import { addCartItem, deleteCartItem, getCart, getCartCount, updateCartItem } from "./cart.service.js";

export const cartController = {
  getCart: async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    try {
      const { userId } = request.user as {
        userId: string;
      };

      const cart = await getCart(userId);

      return reply.send(cart);
    } catch (error) {
      console.error("GET /cart error:", error);

      return reply.status(500).send({
        message: "Failed to fetch cart",
      });
    }
  },

  addCartItem: async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    try {
      const { userId } = request.user as {
        userId: string;
      };

      const item = await addCartItem(
        userId,
        request.body as {
          productId: string;
          variantId?: string;
          quantity: number;
        },
      );

      return reply.status(201).send({
        item,
      });
    } catch (error) {
      console.error("POST /cart/items error:", error);

      if (
        error instanceof Error &&
        error.message === "Product not found"
      ) {
        return reply.status(404).send({
          message: error.message,
        });
      }

      if (
        error instanceof Error &&
        error.message === "Variant not found"
      ) {
        return reply.status(404).send({
          message: error.message,
        });
      }

      if (
        error instanceof Error &&
        error.message === "Insufficient stock"
      ) {
        return reply.status(400).send({
          message: error.message,
        });
      }

      return reply.status(500).send({
        message: "Failed to add item to cart",
      });
    }
  },

  deleteCartItem: async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { userId } = request.user as { userId: string };
    const { id } = request.params as { id: string };

    await deleteCartItem(userId, id);

    return reply.send({
      message: "Cart item removed successfully",
    });
  } catch (error) {
    console.error("DELETE /cart/items/:id error:", error);

    if (
      error instanceof Error &&
      error.message === "Cart item not found"
    ) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    return reply.status(500).send({
      message: "Failed to remove cart item",
    });
  }
},

updateCartItem: async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { userId } = request.user as { userId: string };
    const { id } = request.params as { id: string };

    const item = await updateCartItem(
      userId,
      id,
      request.body as {
        quantity?: number;
        variantId?: string | null;
      },
    );

    return reply.send({ item });
  } catch (error) {
    console.error("PATCH /cart/items/:id error:", error);

    if (
      error instanceof Error &&
      [
        "Cart item not found",
        "Variant not found",
        "Product not found",
      ].includes(error.message)
    ) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message === "Insufficient stock"
    ) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    return reply.status(500).send({
      message: "Failed to update cart item",
    });
  }
},

getCartCount: async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    try {
      const { userId } = request.user as {
        userId: string;
      };

      const count = await getCartCount(userId);

      return reply.send({
        count,
      });
    } catch (error) {
      console.error("GET /cart/count error:", error);

      return reply.status(500).send({
        message: "Failed to fetch cart count",
      });
    }
  },
};