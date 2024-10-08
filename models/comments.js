
const db = require("../db/connection.js");

const { querySelectComment, queryUpdateCommentByIdSum, queryUpdateCommentsByIdNeg,querySelectCommentsByArticleId, querySelectCommentById, queryInsertComment, queryDeleteCommentById } = require("../db/queries.js")


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
  
  return db.query(querySelectCommentsByArticleId, [id])
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

const selectCommentsByCommentId = (id) => {

  
  return db.query(querySelectCommentById, [id])
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

const insertComment = (req) => {
  const {username, body} = req.body;
  const {article_id} = req.params;
  console.log(queryInsertComment, username, body, article_id)
  return db
  .query(
    queryInsertComment , [username, body, 0, parseInt(article_id)]
  )
  .then(comment => {
    
      return comment.rows[0];
  })
  .catch(err => {
    console.log(err)
    return err;
  })
}

const deleteCommentById = (req) => {
  const {comment_id} = req.params;

  return db
  .query(
    queryDeleteCommentById , [comment_id]
  )
  .then(comment => {
    if(comment.rows.length === 0 ){
      return Promise.reject({status: 404, msg: "Not found"})
    }
    return comment.rows[0]
  })
    .catch(err => {
      console.log(err)
      return err;
    })
}
const updateCommentById = (req) => {
  const {comment_id} = req.params;
  const {inc_votes} = req.body;
let query = queryUpdateCommentsByIdNeg;

if (parseInt(inc_votes) >= 0) {
  query = queryUpdateCommentByIdSum;
}
return db
  .query(query, [Math.abs(parseInt(inc_votes)), comment_id])
  .then((comment) => {
    if (comment.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }

    return comment.rows[0];
  })
  .catch((err) => {
    console.log(err);
    return err;
  });
}


module.exports = {selectAllComments, updateCommentById, selectCommentsByArticleId, selectCommentsByCommentId, insertComment, deleteCommentById}