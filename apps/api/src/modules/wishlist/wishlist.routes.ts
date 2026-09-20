import { FastifyInstance } from "fastify";
import { wishlistController } from "./wishlist.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export const wishlistRoutes = async (
    app: FastifyInstance,
) => {
    app.get(
        "/",
        {
            preHandler: authenticate,
        },
        wishlistController.getWishlist,
    );

    app.post(
        "/items",
        {
            preHandler: authenticate,
        },
        wishlistController.addWishlistItem,
    );

    app.delete(
        "/items/:id",
        {
            preHandler: authenticate,
        },
        wishlistController.deleteWishlistItem,
    );
};