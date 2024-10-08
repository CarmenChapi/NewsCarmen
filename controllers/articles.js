const { selectAllArticles, selectArticleById, updateArticleById, insertArticle } = require("../models/articles");

exports.getAllArticles = (req, res, next) => {

  selectAllArticles(req)
    .then((articles) => {
      if (articles.code) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      if (articles.status === 404) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      res.status(200).send({ articles });
    })

    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.getArticlesById = (req, res, next) => {

  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      if (article.code === "22P02") {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      if (article.status === 404) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      res.status(200).send({ article });
    })

    .catch((err) => {
      console.log(err);
      next(err);
    });
}; 

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const {inc_votes} = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      if (article.code === "22P02") {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      if (article.status === 404) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      res.status(200).send({ article });
    })

    .catch((err) => {
      console.log(err);
      next(err);
    });
}; 

exports.postArticle = (req, res, next) => {
console.log("postArticle")
  insertArticle(req)
    .then((article) => {
      console.log(article)
      if (article.code) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      if (article.status === 404) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      article.comment_count = 0
      console.log(article)
      res.status(201).send({ article });
    })

    .catch((err) => {
      console.log(err);
      next(err);
    });
}; 


