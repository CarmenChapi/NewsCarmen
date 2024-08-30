const { selectAllUsers, selectUserById} = require("../models/users")


exports.getAllUsers = (req, res, next) => {

  selectAllUsers(req)
        .then(users => {
        res.status(200).send({ users });
      })
     
      .catch(err => {console.log(err)
       next(err)})
    }

  exports.getUserByID = (req, res, next) => {
    selectUserById(req)
          .then(user => {
            if (user.code) {
              return Promise.reject({ status: 400, msg: "Bad request" });
            }
            if (user.status === 404) {
              return Promise.reject({ status: 404, msg: "Not found" });
            }
          res.status(200).send({ user });
        })
       
        .catch(err => {console.log(err)
         next(err)})
      }