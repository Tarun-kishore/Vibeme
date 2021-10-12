const { DataTypes, where } = require("sequelize");
const sequelize = require("../db/sql");

const confirmationToken = sequelize.define('confirmationToken',{
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
})

confirmationToken.sync()

module.exports = confirmationToken