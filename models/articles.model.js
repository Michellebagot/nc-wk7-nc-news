const db = require("../db/connection");

exports.selectArticleById = (article) => {
  const articleArray = [article.article_id];
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, articleArray)
    .then((result) => {
      return result.rows
    });
};
