const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  if (req.cookies.token) return res.redirect("/user/profile");
  
  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.cookies.token) return res.redirect("/");
  
  res.render("signup");
});

router.get("/success", (req, res) => {
  const options = {};
  if (req.cookies.token) options.loggedIn = true;
  
  res.render("success", options);
});


router.get("/about", (req, res) => {
  const options = {};
  if (req.cookies.token) options.loggedIn = true;
  
  res.render("about", options);
})

router.get("/feature", (req, res) => {
  const options = {};
  if (req.cookies.token) options.loggedIn = true;
  
  res.render("feature", options);
})

router.get("/help", (req, res) => {
  const options = {};
  if (req.cookies.token) options.loggedIn = true;
  
  res.render("help", options);
})

router.get("/", (req, res) => {
  res.redirect('/login')
  // const options = {};
  // if (req.cookies.token) options.loggedIn = true;

  
  // res.render("index", options);
});

router.get("*", (req, res) => {
  const options = {};
  if (req.cookies.token) options.loggedIn = true;

  res.render("404", options);
});

module.exports = router;
