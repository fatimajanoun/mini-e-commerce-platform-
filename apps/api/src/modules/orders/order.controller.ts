import {
    FastifyReply,
    FastifyRequest,
} from "fastify";

import {
    createOrder,
} from "./order.service.js";

export const orderController = {
    createOrder: async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        try {
            const userId =
                (request.user as { userId: string }).userId;

            const data =
                request.body as {
                    name: string;
                    phone: string;
                    address: string;
                    city: string;
                };

            const order =
                await createOrder(
                    userId,
                    data,
                );

            return reply
                .status(201)
                .send({
                    message:
                        "Order placed successfully",

                    order,
                });
        } catch (error) {
            console.error(
                "POST /orders error:",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to place order";

            if (
                message === "Cart not found" ||
                message === "Cart is empty"
            ) {
                return reply
                    .status(400)
                    .send({
                        message,
                    });
            }

            return reply
                .status(500)
                .send({
                    message,
                });
        }
    },
};