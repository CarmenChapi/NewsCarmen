const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors());


const { getAllEndpoints, postEndpoint} = require("./controllers/endpoints")
const {getAllTopics} = require("./controllers/topics")
const {getAllArticles, getArticlesById, patchArticleById, postArticle} = require("./controllers/articles.js")
const {getAllComments, getCommentsByAId, getCommentsByCmId, postComment, deleteComment, patchComment} = require("./controllers/comments.js")
const {getAllUsers, getUserByID} = require("./controllers/users.js")
app.use(express.json());





app.get("/api/topics", getAllTopics);

app.get("/api", getAllEndpoints);
app.post("/api", postEndpoint);

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.patch("/api/articles/:article_id", patchArticleById);
app.post("/api/articles", postArticle);


app.get("/api/articles/:article_id/comments", getCommentsByAId);
app.get("/api/comments", getAllComments);
app.get("/api/comments/:comment_id", getCommentsByCmId);
app.post("/api/articles/:article_id/comments", postComment)
app.delete("/api/comments/:comment_id", deleteComment)
app.patch("/api/comments/:comment_id", patchComment)

app.get("/api/users",getAllUsers)
app.get("/api/users/:username",getUserByID)

//SQL Errors
app.use((err,req,res,next) => {
  if(err.code === '23502'){
    res.status(400).send({msg:"Bad request"})
  }
  if(err.code === '22P02'){
    res.status(400).send({msg:"Bad request"})
  }else{
    next(err)
  }
})


app.use((err, req, res, next) => {
  console.log(err)
  if(err.status === 400){
    res.status(400).send({msg: "Bad request"})
  }
  if(err.status === 404){
    res.status(404).send({msg: "Not found"})
    }
  else{
        next()
  }
})

/*const port = 8080;
app.listen(port, () => {
  console.log(`listening port : ${port}`);
});*/

module.exports = app;