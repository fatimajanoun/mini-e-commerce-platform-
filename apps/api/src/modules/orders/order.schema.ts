import { z } from "zod";

export const createOrderInput = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(255),

    phone: z
        .string()
        .trim()
        .min(5, "Phone number is required")
        .max(50),

    address: z
        .string()
        .trim()
        .min(5, "Address is required")
        .max(500),

    city: z
        .string()
        .trim()
        .min(2, "City is required")
        .max(100),
});

export type CreateOrderInput = z.infer<typeof createOrderInput>;