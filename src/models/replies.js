const { DataTypes, where } = require('sequelize');
const sequelize = require('../db/sql');
const Comment = require('./comments')

const Reply =sequelize.define('Reply',{
    // postReplied:{
    //     type: DataTypes.INTEGER,
    //     references:{
    //         model:'Posts',
    //         key:'id'
    //     },
    //     allowNull:false
    // },
    repliedOn :{
        type: DataTypes.INTEGER,
        references:{
            model:'Comments',
            key:'id'
        },
        allowNull:false
    },
    repliedBy:{
        type: DataTypes.INTEGER,
        references:{
            model:'Users',
            key:'id'
        },
        allowNull:false
    },
    comment:{
        type:DataTypes.STRING,
        allowNull:false
    },
    poster:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    timestamps:true
})

Reply.sync()


module.exports = Reply