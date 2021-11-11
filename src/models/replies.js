// *This files handles database related tasks for connections of replies

// *importing database library and connection 
const { DataTypes, where } = require("sequelize");
const sequelize = require("../db/sql");

// *importing comment model from file
const Comment = require("./comments");

// *defining reply model schema
const Reply = sequelize.define("Reply",{
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Posts",
        key: "id",
      },
      allowNull: false,
    },
    repliedOn: {
      type: DataTypes.INTEGER,
      references: {
        model: "Comments",
        key: "id",
      },
      allowNull: false,
    },
    repliedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    poster: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// *This command allows database to be in sync with server
Reply.sync();

module.exports = Reply;
