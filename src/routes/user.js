const express = require("express");
const { appendFile } = require("fs");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const confirmationToken = require("../models/confirmationToken");
const Token = require("../models/tokens");
const bcrypt = require("bcrypt");
const mail = require("../utils/mail");

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body);

    const token = await user.generateAuthToken();

    return res
      .cookie("token", token, {
        maxAge: 90786787,
        httpOnly: true,
      })
      .redirect("/user/profile");
  } catch (e) {
    res.render("UserActivity/login", { error: e, ...req.body });
  }
});

router.post("/signup", async (req, res) => {
  delete req.body.confirmPassword;
  req.body.firstName = req.body.firstName.trim();
  req.body.lastName = req.body.lastName.trim();
  req.body.email = req.body.email.trim();
  req.body.email = req.body.email.toLowerCase();

  const user = User.build(req.body);
  try {
    const preUser = await User.findOne({
      where: { email: req.body.email, verified: false },
    });

    if (preUser) await preUser.destroy();
    await user.save();

    const token = await user.generateConfirmationToken();

    mail.sendConfirmationMail(
      `${req.headers.host}/user/verify/${user.id}/${token}`,
      user.email
    );

    res.render("IndexPages/verifyEmail", { email: user.email });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/resend", async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email, verified: false },
    });

    if (!user) return res.render("IndexPages/notAuth");

    const token = await confirmationToken.findOne({ where: { user: user.id } });
    mail.sendConfirmationMail(
      `${req.headers.host}/user/verify/${user.id}/${token.token}`,
      user.email
    );
    res.render("IndexPages/verifyEmail", { email: req.body.email });
  } catch (e) {
    res.send(e);
  }
});

router.get("/verify/:id/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.EMAIL_SECRET);

    const token = await confirmationToken.findOne({
      where: { user: decoded._id, token: req.params.token },
    });

    if (!token || decoded._id != req.params.id) return res.redirect("/signup");

    const user = await User.findOne({
      where: { id: decoded._id, verified: false },
    });

    if (!user) {
      await token.destroy();
      return res.redirect("/signup");
    }

    user.verified = true;

    await user.save();

    await token.destroy();

    const authToken = await user.generateAuthToken();

    res
      .cookie("token", authToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .redirect("/user/profile");
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

router.get("/logout", auth, async (req, res) => {
  try {
    await req.token.destroy();

    res.clearCookie("token").redirect("/login");
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/exist", async (req, res) => {
  try {
    req.body.email = req.body.email.trim();
    req.body.email = req.body.email.toLowerCase();
    const user = await User.findOne({ where: req.body });

    if (user) return res.status(200).send({ exist: true });
    res.status(200).send({ exist: false });
  } catch (e) {
    res.status(200).send(e);
  }
});

router.get("/profile", auth, async (req, res) => {
  const userObject = await req.user.getPublicProfile();
  try {
    res.render("UserActivity/profile", {
      loggedIn: true,
      ...userObject,
      image: req.user.profilePicture,
      name: req.user.getFullName(),
    });
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/delete", auth, async (req, res) => {
  res.render("UserActivity/delete", {
    loggedIn: true,
    image: req.user.profilePicture,
    name: req.user.getFullName(),
  });
});
router.delete("/delete", auth, async (req, res) => {
  try {
    await req.user.destroy();
    res.clearCookie("token").redirect("/success");
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

router.get("/update", auth, async (req, res) => {
  const userData = await req.user.getPublicProfile();
  const data = { loggedIn: true, ...userData };
  res.render("UserActivity/updateProfile", {
    ...data,
    image: req.user.profilePicture,
    name: req.user.getFullName(),
  });
});

router.put("/update", auth, async (req, res) => {
  console.log(req.body);
  const updates = Object.keys(req.body);
  if (req.body.profilePicture) {
    const img = JSON.parse(req.body.profilePicture);
    const buffer = new Buffer.from(img.data, "base64");

    req.user.profilePicture = buffer;
  }
  updates.forEach((update) => {
    if (update != "profilePicture") req.user[update] = req.body[update];
  });
  try {
    await req.user.save();
    res.redirect("/success");
  } catch (e) {
    res.send(e);
  }
});

router.get("/change", auth, (req, res) => {
  res.render("UserActivity/changePassword", {
    loggedIn: true,
    image: req.user.profilePicture,
    name: req.user.getFullName(),
  });
});

router.put("/change", auth, async (req, res) => {
  try {
    isMatch = await bcrypt.compare(req.body.oldPassword, req.user.password);
    if (!isMatch)
      return res.render("UserActivity/changePassword", {
        error: "Wrong Old Password",
        loggedIn: true,
        image: req.user.profilePicture,
        name: req.user.getFullName(),
      });
    req.user.password = req.body.password;
    await req.user.save();
    res.redirect("/success");
  } catch (e) {
    res.status(400).send();
  }
});

router.get("/view/:id", auth, async (req, res) => {
  const options = {};
  if (req.cookies.token) options.loggedIn = true;

  try {
    const user = await User.findByPk(req.params.id);
    const userObject = await user.getPublicProfile();
    delete userObject.email;
    res.render("UserActivity/publicProfile", {
      ...options,
      ...userObject,
      image: req.user.profilePicture,
      name: req.user.getFullName(),
    });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
