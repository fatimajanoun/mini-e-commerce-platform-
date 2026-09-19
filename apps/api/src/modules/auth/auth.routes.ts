import { FastifyInstance } from "fastify";

import { authController } from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { loginSchema } from "./auth.schema.js";
import { authenticate } from "../../middleware/authenticate.js";

export const authRoutes = async (app: FastifyInstance) => {
  app.post(
    "/login",
    {
      preHandler: validate(loginSchema, "body"),
    },
    authController.login,
  );
   app.get(
    "/me",
    {
      preHandler: authenticate,
    },
    authController.me,
  );
};