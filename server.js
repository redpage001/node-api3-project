const express = require('express');
const postRouter = require("./posts/postRouter");
const userRounter = require("./users/userRouter");
const cors = require("cors");

const server = express();

const port = process.env.PORT || 8000;

server.use(express.json());
server.use(cors());

server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/api/posts", postRouter);
server.use("/api/users", userRounter);

//custom middleware

function logger(req, res, next) {
  console.log(req.url);
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url}`
  );
  next();
}

server.listen(port, () => {
  console.log(`API is running on ${port}`)
})

module.exports = server;