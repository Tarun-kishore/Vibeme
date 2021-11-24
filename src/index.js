// *importing all environment variables
require("dotenv").config();

// *importing express and creating an instance of it
const express = require("express");
const app = express();

// *cookie-parser handles the cookies at client side
const cookieParser = require("cookie-parser");

// *hbs library handles the hadelbar templating engine
const hbs = require("hbs");

// *methodOverride allows us to create put and delete request from html forms
const methodOverride = require("method-override");

// * initiating the connection with database server
require("./db/sql");

// *http library is used to create a server
const http = require("http");

// *socket-io handles the web socket to implement realtime messaging
const socketIO = require("socket.io");

//*Routes
const userRoutes = require("./routes/user");
const indexRouter = require("./routes/index");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comments");
const connectionRouter = require("./routes/connection");
const messageRouter = require("./routes/messages");
const searchRouter = require("./routes/search");

// *setting the templating engine to handlebars
app.set("view engine", "hbs");

// *setting up views directory path
app.set("views", "src/templates/views");

// * setting up handelbars partial directory path
hbs.registerPartials("src/templates/partials");

// *setting up cookie parser to handle cookies
app.use(cookieParser());

// *Instructing server to use json and extended url encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10 mb" }));

// *Setting up method override library
app.use(methodOverride("_method"));

// *setting up a public folder directory path
app.use(express.static("src/public"));

// *setting up all the routes
app.use("/user", userRoutes);
app.use("/post", postRouter);
app.use("/post/comment", commentRouter);
app.use("/connect", connectionRouter);
app.use("/message", messageRouter);
app.use("/search", searchRouter);
app.use("/", indexRouter);

// *defining port default at 3000
const port = process.env.PORT || 3000;

// *Creating a server for express application
const server = http.Server(app);

// *making server listen at port defined above
server.listen(port, () => {
  console.log("server runnning");
});

// *Setting up a websocket and attaching it to server for real time messaging
const io = socketIO(server);
// *defining web socket
io.on("connection", function (socket) {
  require("./utils/chat")(socket, io);
});
