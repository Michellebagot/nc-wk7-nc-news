const { selectUsers } = require("../models/users.model");

exports.getUsers = (request, response, next) => {
  selectUsers().then((result) => {
    response.status(200).send(result);
  });
};
