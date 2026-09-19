import Fastify from "fastify";

import { authRoutes } from "./modules/auth/auth.routes.js";
import authPlugin from "./plugins/auth.plugin.js";

const app = Fastify({
  logger: true,
});

await app.register(authPlugin);

await app.register(authRoutes, {
  prefix: "/auth",
});

app.get("/health", async () => {
  return { status: "ok" };
});
export default app;