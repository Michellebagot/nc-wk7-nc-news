const { selectUsers, selectUsersByUsername } = require("../models/users.model");

exports.getUsers = (request, response, next) => {
  
  selectUsers().then((result) => {
    response.status(200).send(result);
  });
};

exports.getUserByUsername = (request, response, next) => {
  const username = request.params.username
  selectUsersByUsername(username).then((result) => {
    response.status(200).send(result)
  })
}
