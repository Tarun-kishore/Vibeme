const express = require('express')
const router = express.Router()
const messageThreads = require('../models/messageThreads')
const auth = require('../middlewares/auth')
const { Op } = require('sequelize')
const User = require('../models/user')

router.get('/viewAll', auth, async (req, res) => {
    const options = {
        loggedIn: true
    }
    try {
        options.messageThreads = await messageThreads.findAll({
            where: {
                [Op.or]: [{ member1: req.user.id }, { member2: req.user.id }]
            },
            include: [{
                model: User,
                as: 'firstMember'
            }, {
                model: User,
                as: 'secondMember'
            }]
        })


        for (let i = 0; i < options.messageThreads.length; i++) {
            options.messageThreads[i] = options.messageThreads[i].toJSON()
            if (options.messageThreads[i].firstMember.id === req.user.id) {
                options.messageThreads[i].member = options.messageThreads[i].secondMember
            }
            if (options.messageThreads[i].secondMember.id === req.user.id) {
                options.messageThreads[i].member = options.messageThreads[i].firstMember
            }

            delete options.messageThreads[i].firstMember
            delete options.messageThreads[i].secondMember

            delete options.messageThreads[i].member.password
            delete options.messageThreads[i].member.email

        }

        res.render('UserActivity/messageThreads', options)
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})

router.post('/create/:id', auth, async (req, res) => {
    if (req.params.id == req.user.id) {
        return res.render('IndexPages/notAuth', { loggedIn: true })
    }
    const messageThread = await messageThreads.findOne({
        where: {
            [Op.or]: [{ member1: req.user.id, member2: req.params.id }, { member1: req.params.id, member2: req.user.id }]
        }
    })

    if (messageThread) {
        return res.redirect(`/message/view/${messageThread.id}`)
    }

    const newMessageThread = messageThreads.build({ member1: req.user.id, member2: req.params.id })

    try {
        await newMessageThread.save();
        res.redirect(`/message/view/${newMessageThread.id}`)
    } catch (e) {
        console.log(e)
        res.send(e)
    }

})

router.get('/view/:id', auth, async (req, res) => {
    try {
        const messageThread = await messageThreads.findOne({
            where: { id: req.params.id },
            include: [{
                model: User,
                as: 'firstMember'
            }, {
                model: User,
                as: 'secondMember'
            }]
        })
        const options = { loggedIn: true }

        if (messageThread) {
            if (req.user.id == messageThread.firstMember.id) {
                options.member = `${messageThread.secondMember.firstName} ${messageThread.secondMember.lastName}`
            }
            else if (req.user.id == messageThread.secondMember.id) {
                options.member = `${messageThread.firstMember.firstName} ${messageThread.firstMember.lastName}`
            }
            else return res.render('IndexActivity/notAuth', { loggedIn: true })
            // todo: load messages
            options.id = messageThread.id
            return res.render('UserActivity/messages', options);
        }

        res.redirect('/404')

    } catch (e) {
        console.log(e)
        res.send()
    }
})


module.exports = router