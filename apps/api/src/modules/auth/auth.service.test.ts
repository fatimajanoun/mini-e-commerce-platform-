import { describe, expect, it, vi } from "vitest";
import Fastify from "fastify";
import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import bcrypt from "bcrypt";

import User from "../../db/models/user.js";
import { login } from "./auth.service.js";
import { authRoutes } from "./auth.routes.js";

describe("auth service", () => {
    it("logs in with valid credentials", async () => {
        vi.spyOn(User, "findOne").mockResolvedValue({
            get: (key: string) => {
                if (key === "id") return "test-user-id";
                if (key === "email") return "test@example.com";
                if (key === "password_hash") return "hashed-password";

                return undefined;
            },
        } as any);

        vi.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

        const result = await login(
            "test@example.com",
            "Test123!",
        );

        expect(result).toEqual({
            id: "test-user-id",
            email: "test@example.com",
        });

        vi.restoreAllMocks();
    });

    it("rejects invalid credentials", async () => {
        vi.spyOn(User, "findOne").mockResolvedValue(null);

        await expect(
            login("wrong@example.com", "wrong-password"),
        ).rejects.toThrow("Invalid email or password");

        vi.restoreAllMocks();
    });
});

describe("POST /auth/login", () => {
    it("creates an access_token cookie for valid credentials", async () => {
        vi.resetModules();

        vi.doMock("./auth.service.js", () => ({
            login: vi.fn().mockResolvedValue({
                id: "test-user-id",
                email: "test@example.com",
            }),
        }));

        const { authRoutes } = await import("./auth.routes.js");

        const app = Fastify();

        await app.register(cookie);

        await app.register(jwt, {
            secret: "test-secret",
        });

        await app.register(authRoutes, {
            prefix: "/auth",
        });

        const response = await app.inject({
            method: "POST",
            url: "/auth/login",
            payload: {
                email: "test@example.com",
                password: "Test123!",
            },
        });

        expect(response.statusCode).toBe(200);

        const setCookie = response.headers["set-cookie"];

        expect(setCookie).toBeDefined();
        expect(setCookie).toContain("access_token=");
        expect(setCookie).toContain("HttpOnly");
        expect(setCookie).toContain("SameSite=Lax");
        expect(setCookie).toContain("Max-Age=900");
        expect(setCookie).toContain("Path=/");
    });

    describe("GET /auth/me", () => {
        it("rejects unauthenticated requests", async () => {
            const app = Fastify();

            await app.register(cookie);
            await app.register(jwt, {
                secret: "test-secret",
            });

            await app.register(authRoutes, {
                prefix: "/auth",
            });

            const response = await app.inject({
                method: "GET",
                url: "/auth/me",
            });

            expect(response.statusCode).toBe(401);
            expect(response.json()).toEqual({
                message: "Unauthorized",
            });
        });
    });
});