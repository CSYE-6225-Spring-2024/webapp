const { sq } = require("../../modules/database/connection.js");
const { DataTypes } = require("sequelize");

const User = sq.define(
  "user_records",
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

async function syncDatabase() {
  try {
    await User.sync();
  } catch (error) {
    console.error("Error syncing User Model", error);
  }
}

module.exports = { User, syncDatabase };
