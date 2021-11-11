// * This file establishes a connection of server from database on database server
// * Sequlize library is being used to manage database connection and queries

// ! all database information are saved in environment

const { Sequelize } = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE,process.env.ADMIN, process.env.PASSWORD, {
    host: process.env.DATABASE_HOST,
    port:process.env.DATABASE_PORT,
    dialect: process.env.DIALECT,
    dialectOptions:{
        ssl:{
            required:true,
            rejectUnauthorized: false
        } 
    }
  });

  sequelize.authenticate().then(()=>{
      console.log('Database Connected')
  }).catch((e)=>{
      console.log(e)
  })
  
  module.exports = sequelize