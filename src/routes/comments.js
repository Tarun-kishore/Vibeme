const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Comment = require("../models/comments");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Post = require("../models/posts");
const Reply = require("../models/replies");

router.get("/view/:commentId", auth, async (req, res) => {
  const options = {};
  let userId = "";
  if (req.cookies.token) {
    options.loggedIn = true;
    decoded = jwt.verify(req.cookies.token, process.env.SECRET);
    userId = decoded._id;
  }

  try {
    const comment = await Comment.findByPk(req.params.commentId, {
      include: [{ model: Reply }, { model: Post }],
    });
    if (!comment) res.render("IndexPages/404", options);

    const postObject = await comment.Post.getPost();
    const user = await User.findByPk(postObject.owner);
    const creator = user.getFullName();

    const commentData = await comment.getCommentWithReplies(userId);

    if (commentData.replies.length === 0) delete commentData.replies;
    res.render("PostActivity/publicPostWithComment", {
      ...options,
      postData: { ...postObject, creator },
      comments: commentData,
      image: req.user.profilePicture,
      name: req.user.getFullName(),
    });
  } catch (e) {
    res.status(400).render("IndexPages/404", options);
  }
});

router.post("/create/:postId", auth, async (req, res) => {
  try {
    const comment = Comment.build({
      commentedOn: req.params.postId,
      commentedBy: req.user.id,
      comment: req.body.comment,
      poster: req.user.getFullName(),
    });

    await comment.save();

    res.redirect(`/post/view/${req.params.postId}`);
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

router.delete("/delete/:commentId", auth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);
    if (comment.commentedBy !== req.user.id)
      return res.render("IndexPages/notAuth", { loggedIn: true });
    const postId = comment.commentedOn;

    await comment.destroy();

    res.redirect(`/post/view/${postId}`);
  } catch (e) {
    res.send(e);
  }
});

router.put("/edit/:commentId", auth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);
    if (comment.commentedBy !== req.user.id)
      return res.render("IndexPages/notAuth", { loggedIn: true });
    const postId = comment.commentedOn;

    if (req.body.comment === "") throw Error("empty comment");

    comment.comment = req.body.comment;

    await comment.save();

    res.redirect(`/post/view/${postId}`);
  } catch (e) {
    res.send(e);
  }
});

//replies routes

router.post("/reply/:commentId", auth, async (req, res) => {
  try {
    const comment = await Comment.findOne({
      where: { id: req.params.commentId },
      include: Post,
    });
    const reply = Reply.build({
      postId: comment.Post.id,
      repliedOn: req.params.commentId,
      repliedBy: req.user.id,
      comment: req.body.comment,
      poster: req.user.getFullName(),
    });

    await reply.save();

    res.redirect(`/post/comment/view/${req.params.commentId}`);
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

router.delete("/reply/delete/:replyId", auth, async (req, res) => {
  try {
    const reply = await Reply.findByPk(req.params.replyId);
    if (reply.repliedBy !== req.user.id)
      return res.render("IndexPages/notAuth", { loggedIn: true });
    const commentId = reply.repliedOn;

    await reply.destroy();

    res.redirect(`/post/comment/view/${commentId}`);
  } catch (e) {
    res.send(e);
  }
});

router.put("/reply/edit/:replyId", auth, async (req, res) => {
  try {
    const reply = await Reply.findByPk(req.params.replyId);
    if (reply.repliedBy !== req.user.id)
      return res.render("IndexPages/notAuth", { loggedIn: true });
    const postId = reply.repliedOn;

    if (req.body.comment === "") throw Error("empty comment");

    reply.comment = req.body.comment;

    await reply.save();

    res.redirect(`/post/comment/view/${reply.repliedOn}`);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
