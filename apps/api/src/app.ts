import Fastify from "fastify";
import cors from "@fastify/cors";

import { authRoutes } from "./modules/auth/auth.routes.js";
import authPlugin from "./plugins/auth.plugin.js";

const app = Fastify({
  logger: true,
});

await app.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
});

await app.register(authPlugin);

await app.register(authRoutes, {
  prefix: "/auth",
});

app.get("/health", async () => {
  return { status: "ok" };
});
export default app;