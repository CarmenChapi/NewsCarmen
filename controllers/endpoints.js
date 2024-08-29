const { selectEndpoints, insertEndpoint } = require("../models/endpoints");

exports.getAllEndpoints = (req, res, next) => {
  selectEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })

    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.postEndpoint = (req, res, next) => {

  insertEndpoint(req)
    .then((endpoint) => {
      console.log(endpoint)
      if (endpoint.msg === "Bad request") {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
        res.status(201).send({ endpoint });
    
    })

    .catch(err => {
     // console.log(err);
      next(err);
    });
};
