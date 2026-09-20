import { FastifyReply, FastifyRequest } from "fastify";
import {
    getWishlist,
    addWishlistItem,
    deleteWishlistItem,
} from "./wishlist.service.js";

export const wishlistController = {
    getWishlist: async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        try {
            const { userId } = request.user as {
                userId: string;
            };

            const wishlist = await getWishlist(userId);

            return reply.send(wishlist);
        } catch (error) {
            console.error("GET /wishlist error:", error);

            return reply.status(500).send({
                message: "Failed to fetch wishlist",
            });
        }
    },

    addWishlistItem: async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        try {
            const { userId } = request.user as {
                userId: string;
            };

            const { productId } = request.body as {
                productId: string;
            };

            const item = await addWishlistItem(
                userId,
                productId,
            );

            return reply.status(201).send({ item });
        } catch (error) {
            console.error(
                "POST /wishlist/items error:",
                error,
            );

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
                error.message ===
                "Product already in wishlist"
            ) {
                return reply.status(409).send({
                    message: error.message,
                });
            }

            return reply.status(500).send({
                message: "Failed to add product to wishlist",
            });
        }
    },

    deleteWishlistItem: async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        try {
            const { userId } = request.user as {
                userId: string;
            };

            const { id } = request.params as {
                id: string;
            };

            await deleteWishlistItem(userId, id);

            return reply.send({
                message: "Wishlist item removed successfully",
            });
        } catch (error) {
            console.error(
                "DELETE /wishlist/items/:id error:",
                error,
            );

            if (
                error instanceof Error &&
                error.message === "Wishlist item not found"
            ) {
                return reply.status(404).send({
                    message: error.message,
                });
            }

            return reply.status(500).send({
                message: "Failed to remove wishlist item",
            });
        }
    },
};