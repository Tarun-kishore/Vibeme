const express = require('express')
const router = express.Router()

router.get('/', async(req,res)=>{
    res.send(req.query)
})

module.exports = router