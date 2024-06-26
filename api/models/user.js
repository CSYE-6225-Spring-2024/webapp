const { sq } = require("../../modules/database/connection.js");
const { DataTypes } = require("sequelize");
const { logger } = require("../../modules/logger/logging.js");

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

    verify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    createdAt: "account_created",
    updatedAt: "account_updated",
  }
);

const UserVerified = sq.define(
  "user_verification",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    email_sent_time: {
      type: DataTypes.DATE,
      defaultValue: sq.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    email_verified_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

async function syncDatabase() {
  try {
    await User.sync();
    await UserVerified.sync();
    console.log("Model Synced");
    logger.info("Model Sync Database: Model Syncing");
  } catch (error) {
    console.error("Error syncing User Model", error);
    logger.info("Model Sync Database: Error syncing User Model");
  }
}

module.exports = { User, syncDatabase, UserVerified };
