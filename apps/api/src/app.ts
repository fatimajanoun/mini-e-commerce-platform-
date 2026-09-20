import Fastify from "fastify";
import cors from "@fastify/cors";

import { authRoutes } from "./modules/auth/auth.routes.js";
import authPlugin from "./plugins/auth.plugin.js";
import { productRoutes } from "./modules/products/product.routes.js";
import "./db/models/associations.js";
import { cartRoutes } from "./modules/carts/cart.routes.js";

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

app.register(productRoutes, {
  prefix: "/products",
});

app.register(cartRoutes, {
  prefix: "/cart",
});

app.get("/health", async () => {
  return { status: "ok" };
});
export default app;