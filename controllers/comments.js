
const { selectAllComments, selectCommentsByArticleId, updateCommentById, selectCommentsByCommentId,insertComment, deleteCommentById } = require("../models/comments");

exports.getAllComments = (req, res, next) => {
    selectAllComments(req)
    .then((comments) => {
      res.status(200).send({ comments });
    })

    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.getCommentsByAId = (req, res, next) => {

    const { article_id } = req.params;

    selectCommentsByArticleId(article_id)
      .then((comments) => {
        if (comments.code === '22P02') {
          return Promise.reject({ status: 400, msg: "Bad request" });
        }
        if (comments.status === 404) {
          return Promise.reject({ status: 404, msg: "Not found" });
        }
        res.status(200).send({ comments });
      })
  
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }; 


exports.getCommentsByCmId = (req, res, next) => {

  const { article_id } = req.params;

  selectCommentsByCommentId(article_id)
    .then((comments) => {
      if (comments.code === '22P02') {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      if (comments.status === 404) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      res.status(200).send({ comments });
    })

    .catch((err) => {
      console.log(err);
      next(err);
    });
}; 


  exports.postComment = (req, res, next) => {

    insertComment(req)
      .then((comment) => {
        if (comment.code) {
          return Promise.reject({ status: 400, msg: "Bad request" });
        }
  
        res.status(201).send({ comment});
      })
  
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }; 

  exports.deleteComment = (req, res, next) => {

    deleteCommentById(req)
      .then((comment) => {
        if (comment.code) {
          return Promise.reject({ status: 400, msg: "Bad request" });
        }
        if(comment.status === 404){
          return Promise.reject({ status: 404, msg: "Not found" });
        }
        res.status(204).send({ comment});
      })
  
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }; 

  exports.patchComment= (req, res, next) => {

    updateCommentById(req)
      .then((comment) => {
        if (comment.code) {
          return Promise.reject({ status: 400, msg: "Bad request" });
        }
        if(comment.status === 404){
          return Promise.reject({ status: 404, msg: "Not found" });
        }
        res.status(200).send({ comment});
      })
  
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }; 












  