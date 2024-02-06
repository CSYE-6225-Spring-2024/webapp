const { sq } = require("../../modules/database/connection.js");
const { DataTypes } = require("sequelize");

const User = sq.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "account_created",
    updatedAt: "account_updated",
  }
);

User.sync({})
  .then(() => {
    console.log("Model: User Synced");
  })
  .catch((error) => {
    console.error("Error syncing User Model");
  });

async function syncing(req, res) {
  User.sync({})
    .then(() => {
      console.log("Model: User Synced");
    })
    .catch((error) => {
      console.error("Error syncing User Model");
      res.status(503).send();
      return;
    });
}

module.exports = { User, syncing };
