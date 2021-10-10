const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const Connection = require("../models/connections")

router.post('/send/:id',auth,async (req,res)=>{
    if(req.user.id == req.params.id){
        return res.send("This is your account")
    }

    try {
        const connection = await Connection.findOne({where: {sentBy : req.user.id , sentTo: req.params.id}})
        
        if(connection)
            return res.send("Status pending")

        const newConn = Connection.build({sentBy : req.user.id , sentTo : req.params.id})

        await newConn.save()

        res.redirect('/success')

    } catch (e) {
        res.status(500).send(e)
    }

})

module.exports = router