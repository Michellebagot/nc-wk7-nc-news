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

exports.deleteFromComments = ({ comment_id }) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((result) => {
      return result;
    });
};

exports.selectCommentByCommentId = ({ comment_id }) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then((result) => {
      return result.rows;
    });
};

exports.updateVotesOnCommentByCommentId = ({ comment_id }, { inc_votes }) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING *;`,
      [comment_id, inc_votes]
    )
    .then((result) => {
      return result.rows[0];
    });
};
