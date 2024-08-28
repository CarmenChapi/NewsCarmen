
const db = require("../db/connection.js");

const {querySelectTopics} = require("../db/queries.js")


const selectTopics = () => {
    return db.query(querySelectTopics)
      .then(topics => {
        if(topics.rows.length === 0 ){
          return Promise.reject({status: 404, msg: "Not found"})
        }
      
        return topics.rows;
      })
      .catch(err => {
        console.log(err)
        return err;
      })
}

module.exports = {selectTopics}