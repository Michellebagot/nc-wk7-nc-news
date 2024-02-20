const { selectArticleById } = require("../models/articles.model");
const {
  selectCommentsByArticleId,
  insertCommentToArticle,
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
