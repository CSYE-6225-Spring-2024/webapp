const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PWD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

const checkDBStatus = async () => {
  await sequelize
    .authenticate()
    .then(() => {
      console.log("Database is running");
    })
    .catch((error) => {
      console.log("Database failed to run", error);
    });
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

module.exports = { sq: sequelize, checkConnection, checkDBStatus };
