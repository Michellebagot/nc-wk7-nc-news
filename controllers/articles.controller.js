const {
  selectArticleById,
  selectAllArticles,
  updateArticle,
} = require("../models/articles.model");

exports.getArticleById = (request, response, next) => {
  selectArticleById(request.params)
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (request, response, next) => {
  const topicQuery = request.query.topic;
  const sortBy = request.query.sort_by;
  const orderBy = request.query.order_by;
  selectAllArticles(topicQuery, sortBy, orderBy)
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (request, response, next) => {
  if (request.body.inc_votes === 0) {
    next({ status: 400, msg: "Bad request" });
  }
  selectArticleById(request.params)
    .then((article) => {
      if (article.length !== 0) {
        updateArticle(request.params, request.body).then((article) => {
          response.status(200).send({ article });
        });
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .catch((err) => {
      next(err);
    });
};
