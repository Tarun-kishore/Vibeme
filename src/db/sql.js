const { Sequelize } = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE,process.env.ADMIN, process.env.PASSWORD, {
    host: process.env.DATABASE_HOST,
    port:process.env.DATABASE_PORT,
    dialect: process.env.DIALECT
  });

  sequelize.authenticate().then(()=>{
      console.log('Database Connected')
  }).catch((e)=>{
      console.log(e)
  })
  
  module.exports = sequelize