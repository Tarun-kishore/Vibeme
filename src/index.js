require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const hbs = require("hbs");
const methodOverride = require("method-override");
require("./db/sql");
const http=require('http')
const socketIO = require('socket.io') 

//Routes
const userRoutes = require("./routes/user");
const indexRouter = require("./routes/index");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comments");
const connectionRouter = require("./routes/connection")
const messageRouter = require("./routes/messages");
const searchRouter = require('./routes/search')

app.set("view engine", "hbs");
app.set("views", "src/templates/views");
hbs.registerPartials("src/templates/partials");
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

app.use(express.static("src/public"));

app.use("/user", userRoutes);
app.use("/post", postRouter);
app.use("/post/comment", commentRouter);
app.use("/connect",connectionRouter );
app.use("/message",messageRouter );
app.use("/search",searchRouter)
app.use("/", indexRouter);

const port = process.env.PORT || 3000;

const server = http.Server(app)
server.listen(port, () => {
  console.log("server runnning");
});

const io = socketIO(server)
io.on('connection', function (socket) {
  require('./utils/chat')(socket,io)
});