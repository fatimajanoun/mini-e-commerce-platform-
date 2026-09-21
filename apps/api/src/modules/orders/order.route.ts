import {
    FastifyInstance,
} from "fastify";

import {
    orderController,
} from "./order.controller.js";

import {
    authenticate,
} from "../../middleware/authenticate.js";

import {
    validate,
} from "../../middleware/validate.js";

import {
    createOrderInput,
} from "./order.schema.js";

export const orderRoutes = async (
    app: FastifyInstance,
) => {
    app.post(
        "/",
        {
            preHandler: [
                authenticate,

                validate(
                    createOrderInput,
                    "body",
                ),
            ],
        },

        orderController.createOrder,
    );
};