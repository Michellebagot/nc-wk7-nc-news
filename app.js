const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controller");
const {
  handle500Errors,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./controllers/errors.controller");

app.use(express.json());

// app -GET

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);

// Error controllers

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
