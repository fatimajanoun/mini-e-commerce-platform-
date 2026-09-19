import "dotenv/config";
import Fastify from "fastify";
import sequelize from "./db/index.js";

const app = Fastify({
  logger: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

const start = async () => {
  try {
    await sequelize.authenticate();

    app.log.info("Database connected successfully");

    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0",
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();