const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../../../../.env"),
});

module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: "127.0.0.1",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    dialect: "postgres",
  },

  test: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: "127.0.0.1",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    dialect: "postgres",
  },

  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST || "postgres",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    dialect: "postgres",
  },
};