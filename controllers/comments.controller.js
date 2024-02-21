const { selectArticleById } = require("../models/articles.model");
const {
  selectCommentsByArticleId,
  insertCommentToArticle,
  deleteFromComments,
  selectCommentByCommentId,
} = require("../models/comments.model");

exports.getCommentsByArticleId = (request, response, next) => {
  selectArticleById(request.params)
    .then((article) => {
      if (article.length !== 0) {
        selectCommentsByArticleId(request.params).then((comments) => {
          response.status(200).send({ comments });
        });
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (request, response, next) => {
  const body = request.body.body;
  const username = request.body.username;
  if (
    body.length === 0 ||
    username.length === 0 ||
    typeof body !== "string" ||
    typeof username !== "string"
  ) {
    next({ status: 400, msg: "Bad request" });
  }
  selectArticleById(request.params)
    .then((article) => {
      if (article.length !== 0) {
        insertCommentToArticle(request.params, request.body).then((comment) => {
          response.status(201).send({ comment });
        });
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentByCommentId = (request, response, next) => {
  selectCommentByCommentId(request.params)
    .then((result) => {
      if (result.length !== 0) {
        deleteFromComments(request.params).then(() => {
          response.status(204).send();
        });
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .catch((err) => {
      next(err);
    });
};
