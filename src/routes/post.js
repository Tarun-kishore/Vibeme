const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middlewares/auth");
const Post = require("../models/posts");
const Likes = require("../models/likes");
const Comment = require("../models/comments");
const jwt = require("jsonwebtoken");

//getting all posts
router.get("/all", async (req, res) => {
  const options = {};
  if (req.cookies.token) options.loggedIn = true;

  try {
    const users = await User.findAll({ include: Post });

    let posts = [];

    for (let index = 0; index < users.length; index++) {
      const userPosts = await users[index].getPosts();
      posts = posts.concat(userPosts);
    }

    options.post = posts;
    if (posts) return res.render("PostActivity/feed", options);
    res.render("PostActivity/feed", ...options);
  } catch (e) {
    console.log(e)
    res.status(400).send();
  }
});

//geting user posts
router.get("/my", auth, async (req, res) => {
  try {
    const send = [];
    const options = await req.user.getPosts();
    const likedPost = await req.user.getLikedPosts();
    const commentedPosts = await req.user.getCommentedPosts();
    const repliedPosts = await req.user.getRepliedPosts();
    send.posts = options;
    send.likedPosts = likedPost;
    send.commentedPosts = commentedPosts;
    send.repliedPosts = repliedPosts;

    return res.json(send);
  } catch (error) {
    res.status(500).send();
  }
});

//rendering create post page
router.get("/create", auth, (req, res) => {
  res.render("PostActivity/createPost", { loggedIn: true });
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

    res.redirect("/post/my");
  } catch (e) {
    res.status(400).render("PostActivity/createPost", { loggedIn: true, error: e });
  }
});

// Viewing a post
router.get("/view/:id", async (req, res) => {
  const options = {};
  let userId = "";
  let decoded
  if (req.cookies.token) {
    options.loggedIn = true;
    decoded = jwt.verify(req.cookies.token, process.env.SECRET);
  }

  try {
    const post = await Post.findByPk(req.params.id);
    const postObject = await post.getPost();

    const user = await User.findByPk(postObject.owner);
    const creator = user.getFullName();

    const comments = await post.getComments((decoded ? decoded._id : undefined));

    if (comments.length !== 0)
      return res.render("PostActivity/publicPost", {
        ...options,
        postData: { ...postObject, creator },
        comments: { ...comments },
      });
    res.render("PostActivity/publicPost", {
      ...options,
      postData: { ...postObject, creator },
    });
  } catch (e) {
    console.log(e)
    res.status(400).render("IndexPages/404", options);
  }
});

//rendering edit page
router.post("/edit/:id", auth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (post.owner !== req.user.id) {
      return res.render("IndexPages/notAuth", { loggedIn: true });
    }

    const postData = await post.getPost();

    const creator = `${req.user.firstName} ${req.user.lastName}`;
    res.render("PostActivity/editPost", { loggedIn: true, ...postData, creator });
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

    res.redirect("/post/my");
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

    res.redirect("/post/my");
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
