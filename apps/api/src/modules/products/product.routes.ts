import { FastifyInstance } from "fastify";

import { productController } from "./product.controller.js";

import { validate } from "../../middleware/validate.js";

import { productListSchema } from "./product.schema.js";
import { authenticate } from "../../middleware/authenticate.js";

export const productRoutes = async (
  app: FastifyInstance,
) => {
  app.get(
    "/",
    {
      preHandler:[
        authenticate,
        validate(
        productListSchema,
        "query",),
      ]
    },
    productController.getProducts,
  );

  app.get(
  "/:slug",
    {
      preHandler: authenticate,
    },
  productController.getProductBySlug,
);
};