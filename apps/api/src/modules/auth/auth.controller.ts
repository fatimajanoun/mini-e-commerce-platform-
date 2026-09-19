import { FastifyReply, FastifyRequest } from "fastify";
import { getCurrentUser, login } from "./auth.service.js";

export const authController = {
    login: async (
        request: FastifyRequest,
        reply: FastifyReply
    ) => {
        const { email, password } = request.body as {
            email: string;
            password: string;
        };

        try {
            const user = await login(email, password);

            const token = await reply.jwtSign({
                userId: user.id,
                email: user.email,
            });

            reply.setCookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 15,
            });

            return reply.send({
                user,
            });
        } catch {
            return reply.status(401).send({
                message: "Invalid email or password",
            });
        }
    },

    me: async (
        request: FastifyRequest,
        reply: FastifyReply,
    ) => {
        try {
            const { userId } = request.user as {
                userId: string;
            };

            const user = await getCurrentUser(userId);

            return reply.send({
                user,
            });
        } catch {
            return reply.status(404).send({
                message: "User not found",
            });
        }
    },
};