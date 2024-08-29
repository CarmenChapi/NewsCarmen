
const db = require("../db/connection.js");

const {querySelectArticles, querySelectArticlesById,
  queryUpdateArticlesByIdSum, queryUpdateArticlesByIdNeg
} = require("../db/queries.js")


const selectAllArticles = () => {

    return db.query(querySelectArticles)
      .then(articles => {

        if(articles.rows.length === 0 ){
          return Promise.reject({status: 404, msg: "Not found"})
        }
        return articles.rows;
      })
      .catch(err => {
        console.log(err)
        return err;
      })
}
const selectArticleById = (id) => {
    return db.query(querySelectArticlesById, [id])
      .then(articles => {
        if(articles.rows.length === 0 ){
          return Promise.reject({status: 404, msg: "Not found"})
        }
      
        return articles.rows[0];
      })
      .catch(err => {
        console.log(err)
        return err;
      })
}

const updateArticleById = (id, incVotes) => {
  let query = queryUpdateArticlesByIdNeg;

  if(parseInt(incVotes) >= 0){
    query = queryUpdateArticlesByIdSum
  }
  return db.query(query, [Math.abs(parseInt(incVotes)), id])
  .then(articles => {
    if(articles.rows.length === 0 ){
      return Promise.reject({status: 404, msg: "Not found"})
    }
  
    return articles.rows[0];
  })
  .catch(err => {
    console.log(err)
    return err;
  })
}





module.exports = {selectAllArticles, selectArticleById, updateArticleById}