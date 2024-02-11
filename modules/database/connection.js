const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "test_database",
  process.env.DB_USER || "user",
  process.env.DB_PWD || "cloud_2024",
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  }
);

const checkDbisUp = async () => {
  await sequelize.authenticate();
};

async function checkConnection(req, res) {
  sequelize
    .authenticate()
    .then(() => {})
    .catch((error) => {
      res.status(503).send();
      console.log("from check connection", error);
      return;
    });
}

module.exports = { sq: sequelize, checkConnection, checkDbisUp };
