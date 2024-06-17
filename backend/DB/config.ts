import { config } from "dotenv";
import { Sequelize, Options } from "sequelize"

const sequelize = new Sequelize(
  "Identity_Reconciliation" || process.env.DB_DATABASE_NAME,
  "postgres" || process.env.DB_USERNAME,
  "020300" || process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || "localhost",
  dialect: "postgres",
  logging: false,
});


export default sequelize
