
const db = require("../db/connection.js");

const { querySelectComment, querySelectCommentsByArticleId, queryInsertComment } = require("../db/queries.js")


const selectAllComments = () => {

    return db.query(querySelectComment)
      .then(comments => {

        if(comments.rows.length === 0 ){
          return Promise.reject({status: 404, msg: "Not found"})
        }
        return comments.rows;
      })
      .catch(err => {
        console.log(err)
        return err;
      })
}

const selectCommentsByArticleId = (id) => {
  console.log(typeof id)
  
  return db.query(querySelectCommentsByArticleId, [id])
    .then(comments => {
      if(comments.rows.length === 0 ){
        return Promise.reject({status: 404, msg: "Not found"})
      }
      console.log(comments.rows, comments.rows.length)
      return comments.rows;
    })
    .catch(err => {
      console.log(err)
      return err;
    })
}

const insertComment = (req) => {
  const {username, body} = req.body;
  const {article_id} = req.params;

  return db
  .query(
    queryInsertComment , [username, body, 0, parseInt(article_id)]
  )
  .then(rideData => {
      return rideData.rows[0];
  })
}



module.exports = {selectAllComments, selectCommentsByArticleId, insertComment}