const db = require("../db/connection.js");

const { querySelectUsers, querySelectUserById } = require("../db/queries.js");

const selectAllUsers = (req) => {
  return db
    .query(querySelectUsers)
    .then((users) => {
      if (users.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }

      return users.rows;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

const selectUserById = (req) => {
  const {username} = req.params
  return db
    .query(querySelectUserById, [username])
    .then((user) => {
      if (user.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return user.rows[0];
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

module.exports = { selectAllUsers, selectUserById };
