const { selectAllUsers} = require("../models/users")


exports.getAllUsers = (req, res, next) => {

  selectAllUsers(req)
        .then(users => {
        res.status(200).send({ users });
      })
     
      .catch(err => {console.log(err)
       next(err)})
    }