const express = require("express");
const User = require("../models/user");
const router = express.Router();
const messageThreads = require("../models/messageThreads");
const messages = require("../models/messages");
const auth = require("../middlewares/auth");
const { Op } = require("sequelize");

router.get("/viewAll", auth, async (req, res) => {
  const options = {
    loggedIn: true,
  };
  try {
    options.messageThreads = await messageThreads.findAll({
      where: {
        [Op.or]: [{ member1: req.user.id }, { member2: req.user.id }],
      },
      include: [
        {
          model: User,
          as: "firstMember",
        },
        {
          model: User,
          as: "secondMember",
        },
      ],
    });

    for (let i = 0; i < options.messageThreads.length; i++) {
      options.messageThreads[i] = options.messageThreads[i].toJSON();
      if (options.messageThreads[i].firstMember.id === req.user.id) {
        options.messageThreads[i].member =
          options.messageThreads[i].secondMember;
      }
      if (options.messageThreads[i].secondMember.id === req.user.id) {
        options.messageThreads[i].member =
          options.messageThreads[i].firstMember;
      }

      delete options.messageThreads[i].firstMember;
      delete options.messageThreads[i].secondMember;

      delete options.messageThreads[i].member.password;
      delete options.messageThreads[i].member.email;
    }

    res.render("UserActivity/messageThreads", {
      ...options,
      image: req.user.profilePicture,
      name: req.user.getFullName(),
    });
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

router.post("/create/:id", auth, async (req, res) => {
  if (req.params.id == req.user.id) {
    return res.render("IndexPages/notAuth", { loggedIn: true });
  }
  const messageThread = await messageThreads.findOne({
    where: {
      [Op.or]: [
        { member1: req.user.id, member2: req.params.id },
        { member1: req.params.id, member2: req.user.id },
      ],
    },
  });

  if (messageThread) {
    return res.redirect(`/message/view/${messageThread.id}`);
  }

  const newMessageThread = messageThreads.build({
    member1: req.user.id,
    member2: req.params.id,
  });

  try {
    await newMessageThread.save();
    res.redirect(`/message/view/${newMessageThread.id}`);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

router.get("/view/:id", auth, async (req, res) => {
  try {
    const messageThread = await messageThreads.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          as: "firstMember",
        },
        {
          model: User,
          as: "secondMember",
        },
      ],
    });
    const options = { loggedIn: true };

    if (messageThread) {
      if (req.user.id == messageThread.firstMember.id) {
        options.member = `${messageThread.secondMember.firstName} ${messageThread.secondMember.lastName}`;
      } else if (req.user.id == messageThread.secondMember.id) {
        options.member = `${messageThread.firstMember.firstName} ${messageThread.firstMember.lastName}`;
      } else return res.render("IndexActivity/notAuth", { loggedIn: true });

      options.messages = await messages.findMessages(
        req.params.id,
        req.user.id,
        User
      );

      options.me = req.user.getFullName();

      options.id = messageThread.id;
      return res.render("UserActivity/messages", {
        ...options,
        image: req.user.profilePicture,
        name: req.user.getFullName(),
      });
    }

    res.redirect("/404");
  } catch (e) {
    console.log(e);
    res.send();
  }
});

router.post("/send/:id", auth, async (req, res) => {
  try {
    const messageThread = await messageThreads.findByPk(req.params.id);
    const options = { loggedIn: true };

    if (messageThread) {
      if (
        req.user.id != messageThread.member1 &&
        req.user.id != messageThread.member2
      ) {
        return res.render("IndexActivity/notAuth", { loggedIn: true });
      }

      const receiver =
        req.user.id == messageThread.member1
          ? messageThread.member2
          : messageThread.member1;
      const message = await messages.build({
        thread: req.params.id,
        sender: req.user.id,
        receiver: receiver,
        content: req.body.message,
      });
      await message.save();
      return res.status(200).send();
    }

    res.redirect("/404");
  } catch (e) {
    console.log(e);
    res.send();
  }
});

module.exports = router;

