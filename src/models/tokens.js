// *This files handles database related tasks for connections of tokens for authentication

// *importing database library and connection 
const { DataTypes } = require("sequelize");
const sequelize = require("../db/sql");

// *defining schema of authentication token
const Token = sequelize.define("Token",  {
    user: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// *This command allows the database to be in sync with server
Token.sync();

module.exports = Token;
