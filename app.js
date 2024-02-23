const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const {
  getArticleById,
  getArticles,
  patchArticle,
} = require("./controllers/articles.controller");
const {
  getCommentsByArticleId,
  postComment,
  deleteCommentByCommentId,
  patchCommentByCommentId,
} = require("./controllers/comments.controller");

const {
  handle500Errors,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./controllers/errors.controller");
const { getUsers, getUserByUsername } = require("./controllers/users.controller");

app.use(express.json());

// app -GET

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserByUsername)

//app -POST

app.post("/api/articles/:article_id/comments", postComment);

//app -PATCH

app.patch("/api/articles/:article_id", patchArticle);
app.patch("/api/comments/:comment_id", patchCommentByCommentId)

//app -DELETE

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

// Error controllers

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
