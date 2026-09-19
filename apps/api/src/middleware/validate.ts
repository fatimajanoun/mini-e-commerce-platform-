import { FastifyReply, FastifyRequest } from "fastify";
import { ZodSchema } from "zod";

type RequestPart = "body" | "params" | "query";

export const validate = (
  schema: ZodSchema,
  part: RequestPart
) => {
  return async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const result = schema.safeParse(request[part]);

    if (!result.success) {
      return reply.status(400).send({
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    request[part] = result.data;
  };
};