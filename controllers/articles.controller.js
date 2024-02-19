const { selectArticleById } = require("../models/articles.model");

exports.getArticleById = (request, response, next) => {
  selectArticleById(request.params)
    .then((article) => {
      if (article.length === 0) {
        response.status(404).send({ status: 404, msg: "Not found" });
      }
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
