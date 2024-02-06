const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "test_database",
  process.env.DB_USER || "user",
  process.env.DB_PWD || "cloud_2024",
  {
    host: "localhost",
    dialect: "postgres",
  }
);

module.exports = { sq: sequelize };
