const { selectTopics } = require("../models/topics");

exports.getAllTopics = (req, res, next) => {
  selectTopics(req)
    .then((topics) => {
      res.status(200).send({ topics });
    })

    .catch((err) => {
      console.log(err);
      next(err);
    });
};
