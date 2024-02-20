const { selectArticleById } = require("../models/articles.model");
const { selectCommentsByArticleId } = require("../models/comments.model");

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
