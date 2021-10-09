const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nextTick } = require("process");
const { DataTypes, where } = require("sequelize");
const sequelize = require("../db/sql");
const Token = require("./tokens");
const Post = require("./posts");
const Like = require("./likes");
const Comment = require("./comments");
const Reply = require("./replies");

const User = sequelize.define("User",  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    email: {
      type: DataTypes.STRING,
      trim: true,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      trim: true,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

User.findByCredentials = async function ({ email, password }) {
  email = email.trim();
  email = email.toLowerCase();
  const user = await User.findOne({ where: { email } });

  if (!user) throw new Error("Invalid Credentials");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Invalid Credentials");

  return user;
};

User.prototype.getFullName = function () {
  const user = this.toJSON();

  return `${user.firstName} ${user.lastName}`;
};

User.prototype.getPublicProfile = function () {
  const userObject = this.toJSON();

  delete userObject.password;
  return userObject;
};

User.prototype.getPosts = async function () {
  const userObject = this.toJSON();

  let posts;
  posts = await Post.findAll({ where: { owner: userObject.id } });
  
  let options = [];
  let postData;
  
  for (let i = 0; i < posts.length; i++) {
    post = posts[i];
    postData = await post.getPost();

    options = options.concat({ ...postData, creator: this.getFullName() });
  }

  return options;
};

User.prototype.getLikedPosts = async function () {
  const user = this.toJSON();

  const likedPost = await Like.findAll({ where: { likedBy: user.id } });

  let options = [];
  let postData;

  for (let i = 0; i < likedPost.length; i++) {
    const post = await Post.findByPk(likedPost[i].likedPost);

    postData = await post.getPost();

    options = options.concat({ ...postData, creator: this.getFullName() });
  }

  return options;
};

User.prototype.getCommentedPosts = async function () {
  const user = this.toJSON();
  const comments = await Comment.findAll({
    where: { commentedBy: user.id },
    include: Post,
  });
  let options = [];

  for (let j = 0; j < comments.length; j++) {
    const posts = comments[j].Post;
    const postData = await post.getPost();

    options = options.concat({ ...postData, creator: this.getFullName() });
  }

  return options;
};

User.prototype.getRepliedPosts = async function () {
  const user = this.toJSON();
  const replies = await Reply.findAll({
    where: { repliedBy: user.id },
    include: Post,
  });
  let options = [];
  for (let j = 0; j < replies.length; j++) {
    const posts = replies[j].Post;
    const postData = await post.getPost();

    options = options.concat({ ...postData, creator: this.getFullName() });
  }

  return options;
};

User.prototype.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user.id }, process.env.SECRET);

  const tokenData = Token.build({ user: user.id, token });

  await tokenData.save();

  return token;
};

User.beforeSave(async (user, options) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

User.hasMany(Token, {
  foreignKey: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Token.belongsTo(User, {
  foreignKey: "user",
});

User.hasMany(Post, {
  foreignKey: "owner",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Post.belongsTo(User, {
  foreignKey: "owner",
});

User.hasMany(Like, {
  foreignKey: "likedBy",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Like.belongsTo(User, {
  foreignKey: "likedBy",
});

User.hasMany(Comment, {
  foreignKey: "commentedBy",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Comment.belongsTo(User, {
  foreignKey: "commentedBy",
});

User.hasMany(Reply, {
  foreignKey: "repliedBy",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Reply.belongsTo(User, {
  foreignKey: "repliedBy",
});
User.sync();

module.exports = User;
