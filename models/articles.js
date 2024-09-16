const db = require("../db/connection.js");
const validOrderValues = ["ASC", "asc", "DESC", "desc"];
const validSortByValues = [
  "author",
  "title",
  "votes",
  "article_id",
  "body",
  "topic",
  "created_at",
  "article_img_url",
];
const validTopicValues = ["mitch", "cats", "paper"];

const {
  querySelectArticles,
  querySelectArticlesById,
  queryUpdateArticlesByIdSum,
  queryUpdateArticlesByIdNeg,
  queryInsertArticle,
  queryInsertArticleWithImgUrl
} = require("../db/queries.js");

const selectAllArticles = (req) => {
  const { sort_by, order, topic } = req.query;

  let query = querySelectArticles;

  if (validTopicValues.includes(topic)) {
    query += ` WHERE articles.topic like '${topic}' `;
  }

  if (validSortByValues.includes(sort_by)) {
    query += ` GROUP BY articles.article_id 
    ORDER BY articles.${sort_by} `;
  } else {
    query += ` GROUP BY articles.article_id 
    ORDER BY articles.created_at `;
  }

  if (validOrderValues.includes(order)) {
    query += order + ` ;`;
  } else {
    query += ` DESC ;`;
  }

  return db
    .query(query)
    .then((articles) => {
      if (articles.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return articles.rows;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};
const selectArticleById = (id) => {
  return db
    .query(querySelectArticlesById, [id])
    .then((articles) => {
      if (articles.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }

      return articles.rows[0];
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

const updateArticleById = (id, incVotes) => {
  let query = queryUpdateArticlesByIdNeg;

  if (parseInt(incVotes) >= 0) {
    query = queryUpdateArticlesByIdSum;
  }
  return db
    .query(query, [Math.abs(parseInt(incVotes)), id])
    .then((articles) => {
      if (articles.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }

      return articles.rows[0];
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

const insertArticle = (req) => {

  const {author, title, body, topic, article_img_url
  } = req.body;
  let query = queryInsertArticle
  const paramsQuery = [author, title, body, topic]
  if(article_img_url){
    paramsQuery.push(article_img_url)
    query = queryInsertArticleWithImgUrl
  }
console.log(query, paramsQuery)
  return db
  .query(
    query , paramsQuery
  )
  .then(comment => {
      return comment.rows[0];
  })
};

module.exports = { selectAllArticles, selectArticleById, updateArticleById , insertArticle};
