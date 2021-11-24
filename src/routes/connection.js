const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const auth = require("../middlewares/auth");
const User = require("../models/user");
const Connection = require("../models/connections");

router.post("/send/:id", auth, async (req, res) => {
  if (req.user.id == req.params.id) {
    return res.send("This is your account");
  }

  try {
    const connection = await Connection.findOne({
      where: {
        [Op.or]: [
          { sentBy: req.user.id, sentTo: req.params.id },
          { sentBy: req.params.id, sentTo: req.user.id },
        ],
      },
    });

    if (connection) return res.send("Status pending or already in connection");

    const newConn = Connection.build({
      sentBy: req.user.id,
      sentTo: req.params.id,
    });

    await newConn.save();

    res.redirect("/success");
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/view", auth, async (req, res) => {
  const options = {};

  options.loggedIn = true;

  try {
    options.myConnections = await Connection.findAll({
      where: {
        [Op.or]: [{ sentTo: req.user.id }, { sentBy: req.user.id }],
        pending: false,
      },
      include: [
        {
          model: User,
          as: "receiver",
        },
        {
          model: User,
          as: "sender",
        },
      ],
    });

    options.sentConnections = await Connection.findAll({
      where: {
        sentBy: req.user.id,
        pending: true,
      },
      include: [
        {
          model: User,
          as: "receiver",
        },
      ],
    });

    options.receivedConnections = await Connection.findAll({
      where: {
        sentTo: req.user.id,
        pending: true,
      },
      include: [
        {
          model: User,
          as: "sender",
        },
      ],
    });

    //formating output to json

    for (let i = 0; i < options.myConnections.length; i++) {
      options.myConnections[i] = options.myConnections[i].toJSON();
      if (options.myConnections[i].sender.id === req.user.id) {
        options.myConnections[i].connector = options.myConnections[i].receiver;
      }
      if (options.myConnections[i].receiver.id === req.user.id) {
        options.myConnections[i].connector = options.myConnections[i].sender;
      }

      delete options.myConnections[i].sender;
      delete options.myConnections[i].receiver;

      delete options.myConnections[i].connector.password;
      delete options.myConnections[i].connector.email;
    }

    for (let i = 0; i < options.sentConnections.length; i++) {
      options.sentConnections[i] = options.sentConnections[i].toJSON();
      delete options.sentConnections[i].receiver.password;
      delete options.sentConnections[i].receiver.email;
    }

    for (let i = 0; i < options.receivedConnections.length; i++) {
      options.receivedConnections[i] = options.receivedConnections[i].toJSON();
      delete options.receivedConnections[i].sender.password;
      delete options.receivedConnections[i].sender.email;
    }

    res.render("UserActivity/connections", {
      ...options,
      image: req.user.profilePicture,
      name: req.user.getFullName(),
    });
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});

router.patch("/accept/:id", auth, async (req, res) => {
  const connection = await Connection.findByPk(req.params.id);
  console.log(connection.sentTo);

  if (connection.sentTo !== req.user.id) {
    return res.render("notAuth", { loggedIn: true });
  }

  try {
    connection.pending = false;

    await connection.save();

    res.redirect("/connect/view");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }

  res.send();
});

router.delete("/remove/:id", auth, async (req, res) => {
  const connection = await Connection.findByPk(req.params.id);

  if (connection.sentTo !== req.user.id && connection.sentBy !== req.user.id) {
    return res.render("notAuth", { loggedIn: true });
  }

  try {
    await connection.destroy();

    res.redirect("/connect/view");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }

  res.send();
});

module.exports = router;

