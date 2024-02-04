const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  "postgres://user:cloud_2024@localhost:5432/test_database",
  {
    dialect: "postgres",
  }
);

module.exports = { sq: sequelize };
