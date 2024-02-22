const db = require("../db/connection");

exports.selectArticleById = (article) => {
  const articleArray = [article.article_id];
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, articleArray)
    .then((result) => {
      return result.rows;
    });
};

exports.selectAllArticles = (topicQuery) => {
  let queryValues = [];
  let queryString =
    "SELECT articles.author, title, articles.article_id, articles.topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT (comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id";

  if (topicQuery) {
    queryValues.push(topicQuery);
    queryString += " WHERE topic = $1";
  }

  queryString +=
    " GROUP BY articles.article_id ORDER BY articles.created_at DESC;";

  return db.query(queryString, queryValues).then((result) => {
    return result.rows;
  });
};

exports.selectCommentsByArticleId = ({ article_id }) => {
  const articleArray = [article_id];
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, articleArray)
    .then((result) => {
      return result.rows;
    });
};

exports.updateArticle = ({ article_id }, { inc_votes }) => {
  const articleArray = [article_id, inc_votes];
  return db
    .query(
      `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;`,
      articleArray
    )
    .then((result) => {
      return result.rows[0];
    });
};
