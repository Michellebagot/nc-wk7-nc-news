const { selectTopics } = require("../models/topics.model");

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      if (topics.length === 0) {
        response.status(400).send({ status: 400, message: "not found" });
      }
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
