const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  if (req.cookies.token) return res.redirect("/user/profile");

  res.render("UserActivity/login");
});

router.get("/signup", (req, res) => {
  res.redirect("/login");
});

router.get("/success", (req, res) => {
  const options = {};
  if (req.cookies.token) options.loggedIn = true;

  res.render("IndexPages/success", options);
});

router.get("/about", (req, res) => {
  const options = {};
  if (req.cookies.token) options.loggedIn = true;

  res.render("IndexPages/about", options);
});

router.get("/feature", (req, res) => {
  const options = {};
  if (req.cookies.token) options.loggedIn = true;

  res.render("IndexPages/feature", options);
});

router.get("/help", (req, res) => {
  const options = {};
  if (req.cookies.token) options.loggedIn = true;

  res.render("IndexPages/help", options);
});

router.get("/", (req, res) => {
  // res.redirect('/login')
  const options = {};
  if (req.cookies.token) options.loggedIn = true;

  res.render("IndexPages/index", options);
});
router.get("/notAuth", (req, res) => {
  res.render("IndexPages/notAuth");
});

router.get("/success", (req, res) => {
  res.render("IndexPages/success");
});

router.get("*", (req, res) => {
  const options = {};
  if (req.cookies.token) options.loggedIn = true;

  res.render("IndexPages/404", options);
});

module.exports = router;
