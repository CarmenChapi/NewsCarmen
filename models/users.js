
const db = require("../db/connection.js");

const {querySelectUsers} = require("../db/queries.js")


const selectAllUsers = () => {
    return db.query(querySelectUsers)
      .then(users => {
        if(users.rows.length === 0 ){
          return Promise.reject({status: 404, msg: "Not found"})
        }
      
        return users.rows;
      })
      .catch(err => {
        console.log(err)
        return err;
      })
}

module.exports = {selectAllUsers}