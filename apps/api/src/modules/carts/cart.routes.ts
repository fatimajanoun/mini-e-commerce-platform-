import { FastifyInstance } from "fastify";

import { cartController } from "./cart.controller.js";
import { addCartItemSchema, updateCartItemSchema } from "./cart.schema.js";

import { validate } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";

export const cartRoutes = async (
    app: FastifyInstance,
) => {
    app.get(
        "/",
        {
            preHandler: authenticate,
        },
        cartController.getCart,
    );

    app.post(
        "/items",
        {
            preHandler: [
                authenticate,
                validate(addCartItemSchema, "body"),
            ],
        },
        cartController.addCartItem,
    );

    app.delete(
        "/items/:id",
        {
            preHandler: authenticate,
        },
        cartController.deleteCartItem,
    );

    app.patch(
        "/items/:id",
        {
            preHandler: [
                authenticate,
                validate(updateCartItemSchema, "body"),
            ],
        },
        cartController.updateCartItem,
    );
};