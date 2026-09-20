import { FastifyReply, FastifyRequest } from "fastify";

import {
    getProductBySlug,
    getProducts,
} from "./product.service.js";

export const productController = {
    getProducts: async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        try {
            const { page, limit } = request.query as {
                page: number;
                limit: number;
            };

            const result = await getProducts({
                page,
                limit,
            });

            return reply.send(result);
        } catch (error) {
            console.error("GET /products error:", error);
            return reply.status(500).send({
                message: "Failed to fetch products",
            });
        }
    },

    getProductBySlug: async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        try {
            const { slug } = request.params as {
                slug: string;
            };

            const product = await getProductBySlug(slug);

            return reply.send({
                product,
            });
        } catch (error) {
            console.error("GET /products/:slug error:", error);

            return reply.status(404).send({
                message: "Product not found",
            });
        }
    },
};

