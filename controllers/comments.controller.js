const { selectArticleById } = require("../models/articles.model");
const { selectCommentsByArticleId } = require("../models/comments.model");

exports.getCommentsByArticleId = (request, response, next) => {
  selectCommentsByArticleId(request.params)
    .then((comments) => {
      if (comments.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
