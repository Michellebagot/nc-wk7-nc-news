const db = require("../db/connection");

exports.selectCommentsByArticleId = ({ article_id }) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertCommentToArticle = ({ article_id }, { username, body }) => {
  const values = [article_id, username, body];
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
      values
    )
    .then((result) => {
      return result.rows[0];
    });
};
