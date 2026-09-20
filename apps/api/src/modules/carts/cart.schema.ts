import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().uuid(),

  variantId: z.string().uuid().optional(),

  quantity: z.coerce
    .number()
    .int()
    .positive(),
});

export const updateCartItemSchema = z
  .object({
    quantity: z.coerce.number().int().positive().optional(),
    variantId: z.string().uuid().nullable().optional(),
  })
  .refine(
    (data) =>
      data.quantity !== undefined ||
      data.variantId !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;