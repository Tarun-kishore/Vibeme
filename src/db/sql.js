const { Sequelize } = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE,process.env.ADMIN, process.env.PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
  });

  sequelize.authenticate().then(()=>{
      console.log('Database Connected')
  }).catch((e)=>{
      console.log(e)
  })
  
  module.exports = sequelize