
const db = require("../db/connection.js");
const validOrderValues = ["ASC", "asc", "DESC", "desc"]
const validSortByValues = ["author", "title","votes", "article_id", "body","topic","created_at","article_img_url"]


const {querySelectArticles, querySelectArticlesById,
  queryUpdateArticlesByIdSum, queryUpdateArticlesByIdNeg
} = require("../db/queries.js")


const selectAllArticles = (req) => {

  const {sort_by, order} = req.query
  console.log(sort_by, order)
  let query = querySelectArticles

  if(validSortByValues.includes(sort_by)){
    query += `ORDER BY articles.${sort_by} `;
  }
  else{
    query += `ORDER BY articles.created_at `;
  }
  
  if(validOrderValues.includes(order)){
    query += order + ` ;`
  }
  else{
    query += ` DESC ;`
  }
  


console.log(query)
    return db.query(query)
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