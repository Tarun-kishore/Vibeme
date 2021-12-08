// *bcrypt library is used for password hashing
const bcrypt = require("bcrypt");

// *jsonwebtoken library is used to generate and verify authentication tokens
const jwt = require("jsonwebtoken");

// *database related imports
const { DataTypes, Op, where } = require("sequelize");
const sequelize = require("../db/sql");

// *importing models from other files
const Token = require("./tokens");
const Post = require("./posts");
const Like = require("./likes");
const Comment = require("./comments");
const Reply = require("./replies");
const Connection = require("./connections");
const confirmationToken = require("./confirmationToken");
const messageThreads = require("../models/messageThreads");
const messages = require("../models/messages");

//* importing image buffer for default profile profilePicture
const imageBuffer = require("../utils/imageData");
// *defining user schema
const User = sequelize.define(
  "User",
  {
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
    profilePicture: {
      type: DataTypes.BLOB("long"),
      get() {
        if (
          this.getDataValue("profilePicture") &&
          typeof this.getDataValue("profilePicture") !== "string"
        )
          return (
            "data:image/png;base64," +
            this.getDataValue("profilePicture").toString("base64")
          );
        return this.getDataValue("profilePicture");
      },
    },
    bio: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    qualities: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

User.prototype.toJSON = function () {
  const user = this.dataValues;
  if (typeof user.profilePicture !== "string")
    user.profilePicture =
      "data:image/png;base64," + user.profilePicture.toString("base64");
  return user;
};

// *This function return user having email and password passed to it in object
User.findByCredentials = async function ({ email, password }) {
  email = email.trim();
  email = email.toLowerCase();
  const user = await User.findOne({ where: { email } });

  if (!user) throw new Error("Invalid Credentials");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Invalid Credentials");

  return user;
};

// *This function just concatenate first Name and last name to generate full name
User.prototype.getFullName = function () {
  const user = this.toJSON();

  return `${user.firstName} ${user.lastName}`;
};

// *This function handles abstraction and remove sensitive data before passing it to client
User.prototype.getPublicProfile = async function () {
  const userObject = this.toJSON();
  try {
    const post = await Post.findAll({
      where: {
        owner: this.id,
      },
    });
    userObject.postCount = post.length;

    const connections = await Connection.findAll({
      where: {
        pending: false,
        [Op.or]: [{ sentTo: this.id }, { sentBy: this.id }],
      },
    });

    userObject.connectionsCount = connections.length;
  } catch (e) {
    console.log(e);
  }
  delete userObject.password;
  return userObject;
};

// *This function return all posts of a user
User.prototype.getPosts = async function (id) {
  let posts;
  posts = await Post.findAll({ where: { owner: this.id } });

  let options = [];
  let postData;

  for (let i = 0; i < posts.length; i++) {
    post = posts[i];
    postData = await post.getPost();

    options = options.concat({
      ...postData,
      creator: this.getFullName(),
      userImage: this.profilePicture,
    });
  }

  return options;
};

// *This function return posts liked by the user
User.prototype.getLikedPosts = async function (id) {
  const user = this.toJSON();

  const likedPost = await Like.findAll({ where: { likedBy: user.id } });

  let options = [];
  let postData;

  for (let i = 0; i < likedPost.length; i++) {
    const post = await Post.findByPk(likedPost[i].likedPost);

    postData = await post.getPost(id);

    options = options.concat({
      ...postData,
      creator: this.getFullName(),
    });
  }

  return options;
};

// *This function return post on which the user commented
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

// *This function return all posts on which the user replied
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

// *This function generate authentication token to start its session
User.prototype.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user.id }, process.env.SECRET);

  const tokenData = Token.build({ user: user.id, token });

  await tokenData.save();

  return token;
};

// *This function generate token which is sent to user to confirm their account
User.prototype.generateConfirmationToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user.id }, process.env.EMAIL_SECRET);

  const tokenData = confirmationToken.build({ user: user.id, token });

  await tokenData.save();

  return token;
};

// *This function handles the queries for non-verified users
User.beforeFind((options) => {
  if (!options.where) {
    options.where = {};
  }
  if (!options.where || options.where.verified === undefined) {
    options.where.verified = true;
  }
});

// *This function makes sure the hash of password is saved before saving
// !we do not save password without hashing because of security reasons because in case of database breach someone don't get access to user
User.beforeSave(async (user, options) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  if (user.profilePicture === null) {
    user.profilePicture = imageBuffer;
  }
  if (user.changed("firstName") || user.changed("lastName")) {
    const comments = await Comment.findAll({ where: { commentedBy: user.id } });
    const replies = await Reply.findAll({ where: { repliedBy: user.id } });

    comments.forEach(async (comment) => {
      comment.poster = user.getFullName();
      await comment.save();
    });

    replies.forEach(async (reply) => {
      reply.poster = user.getFullName();
      await reply.save();
    });
  }
});

// *defining the relations between various models
User.hasMany(Token, {
  foreignKey: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Token.belongsTo(User, {
  foreignKey: "user",
});

User.hasMany(confirmationToken, {
  foreignKey: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

confirmationToken.belongsTo(User, {
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

User.hasMany(Connection, {
  foreignKey: "sentTo",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "receivedConnection",
});

Connection.belongsTo(User, {
  foreignKey: "sentTo",
  as: "receiver",
});

User.hasMany(Connection, {
  foreignKey: "sentBy",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "sentConnection",
});

Connection.belongsTo(User, {
  foreignKey: "sentBy",
  as: "sender",
});

User.hasMany(messageThreads, {
  foreignKey: "member1",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "member1Thread",
});

messageThreads.belongsTo(User, {
  foreignKey: "member1",
  as: "firstMember",
});

User.hasMany(messageThreads, {
  foreignKey: "member2",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "member2Thread",
});

messageThreads.belongsTo(User, {
  foreignKey: "member2",
  as: "secondMember",
});

User.hasMany(messages, {
  foreignKey: "sender",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "sentMessage",
});

messages.belongsTo(User, {
  foreignKey: "sender",
  as: "senderUser",
});

User.hasMany(messages, {
  foreignKey: "receiver",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "receivedMessage",
});

messages.belongsTo(User, {
  foreignKey: "receiver",
  as: "receiverUser",
});

//*this command keeps the database in sync with server
User.sync();

module.exports = User;
