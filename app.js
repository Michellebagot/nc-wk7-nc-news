const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller");
const {
  handle500Errors,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./controllers/errors.controller");

app.use(express.json());

// app -GET

app.get("/api/topics", getTopics);

// Error controllers

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
