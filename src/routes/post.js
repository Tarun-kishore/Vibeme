const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middlewares/auth");
const Post = require("../models/posts");
const Likes = require("../models/likes");
const Comment = require("../models/comments");
const jwt = require("jsonwebtoken");

//getting all posts
router.get("/all", auth, async (req, res) => {
  const options = {};
  if (req.cookies.token) options.loggedIn = true;

  try {
    const users = await User.findAll();

    let posts = [];

    for (let index = 0; index < users.length; index++) {
      const userPosts = await users[index].getPosts(req.user.id);
      posts = posts.concat(userPosts);
    }

    options.post = posts;
    res.render("PostActivity/feed", {
      ...options,
      name: req.user.getFullName(),
      image: req.user.profilePicture,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

//geting user posts
router.post("/my", auth, async (req, res) => {
  try {
    const send = [];
    const options = await req.user.getPosts();
    const likedPost = await req.user.getLikedPosts(req.user.id);
    const commentedPosts = await req.user.getCommentedPosts();
    const repliedPosts = await req.user.getRepliedPosts();
    send.posts = options;
    send.likedPosts = likedPost;
    send.commentedPosts = commentedPosts;
    send.repliedPosts = repliedPosts;

    return res.send({ ...send });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

//geting user posts with id
router.post("/user", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.body.id);
    const send = [];
    const options = await user.getPosts();
    const likedPost = await user.getLikedPosts();
    const commentedPosts = await user.getCommentedPosts();
    const repliedPosts = await user.getRepliedPosts();
    send.posts = options;
    send.likedPosts = likedPost;
    send.commentedPosts = commentedPosts;
    send.repliedPosts = repliedPosts;

    return res.send({ ...send });
  } catch (error) {
    res.status(500).send();
  }
});
//rendering create post page
router.get("/create", auth, (req, res) => {
  res.render("PostActivity/createPost", {
    loggedIn: true,
    name: req.user.getFullName(),
    image: req.user.profilePicture,
  });
});

// Creating post by a user
router.post("/create", auth, async (req, res) => {
  try {
    const img = JSON.parse(req.body.image);
    const buffer = new Buffer.from(img.data, "base64");

    const post = Post.build({
      owner: req.user.id,
      image: buffer,
      content: req.body.content,
    });
    await post.save();

    res.redirect("/user/profile");
  } catch (e) {
    res.status(400).redirect("/post/create");
  }
});

// Viewing a post
router.get("/view/:id", auth, async (req, res) => {
  const options = {};
  let userId = "";
  let decoded;

  try {
    const post = await Post.findByPk(req.params.id);
    const postObject = await post.getPost(req.user.id);

    const user = await User.findByPk(postObject.owner);
    const creator = user.getFullName();

    const comments = await post.getComments(req.user.id);

    if (comments.length !== 0)
      return res.render("PostActivity/publicPost", {
        ...options,
        postData: { ...postObject, creator },
        comments: { ...comments },
        image: req.user.profilePicture,
        name: req.user.getFullName(),
      });
    res.render("PostActivity/publicPost", {
      ...options,
      postData: { ...postObject, creator },
      name: req.user.getFullName(),
      image: req.user.profilePicture,
    });
  } catch (e) {
    console.log(e);
    res.status(400).redirect("/404");
  }
});

//rendering edit page
router.post("/edit/:id", auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (post.owner !== req.user.id) {
      return res.render("IndexPages/notAuth", {
        loggedIn: true,
        name: req.user.getFullName(),
        image: req.user.profilePicture,
      });
    }

    const postData = await post.getPost();

    const creator = `${req.user.firstName} ${req.user.lastName}`;
    res.render("PostActivity/editPost", {
      loggedIn: true,
      ...postData,
      creator,
      name: req.user.getFullName(),
      image: req.user.profilePicture,
    });
  } catch (e) {
    res.status(500).render("IndexPages/404", { loggedIn: true });
  }
});

//editing a post
router.put("/edit/:id", auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (post.owner !== req.user.id) {
      return res.render("IndexPages/notAuth", { loggedIn: true });
    }

    let changed = false;
    if (req.body.image) {
      const img = JSON.parse(req.body.image);
      const buffer = new Buffer.from(img.data, "base64");

      changed = true;
      post.image = buffer;
    }

    if (req.body.content) {
      changed = true;
      post.content = req.body.content;
    }

    if (changed) await post.save();

    res.redirect("/user/profile");
  } catch (e) {
    res.status(500).render("IndexPages/404", { loggedIn: true });
  }
});

// Deleting a post
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (post.owner !== req.user.id) {
      return res.render("IndexPages/notAuth", { loggedIn: true });
    }

    await post.destroy();

    res.redirect("/user/profile");
  } catch (e) {
    res.status(500).render("IndexPages/404", { loggedIn: true });
  }
});

//handling likes on post
router.post("/isLiked", auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.body.post);

    if (!post) throw new Error("no such post exist");

    const like = await Likes.findOne({
      where: { likedBy: req.user.id, likedPost: req.body.post },
    });

    if (!like) return res.send({ liked: false });

    res.send({ liked: true });
  } catch (e) {
    res.send(e);
  }
});

router.post("/hit", auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.body.post);

    if (!post) throw new Error("no such post exist");

    const like = await Likes.findOne({
      where: { likedBy: req.user.id, likedPost: req.body.post },
    });

    if (!like) {
      const likeObject = Likes.build({
        likedBy: req.user.id,
        likedPost: req.body.post,
      });

      await likeObject.save();

      return res.send({ like: true });
    }

    await like.destroy();

    res.send({ like: false });
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
