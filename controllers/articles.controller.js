const {
  selectArticleById,
  selectAllArticles,
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
  selectAllArticles()
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

