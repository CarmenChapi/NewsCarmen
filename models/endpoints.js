const fs = require("fs");
const fsPromises = require("fs").promises;

const selectEndpoints = () => {
  return fs.promises
    .readFile("endpoints.json", "utf-8")
    .then((endP) => {
      const parseEndP = JSON.parse(endP);
      return parseEndP;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

const insertEndpoint = (req) => {
  const endPToInsert = req.body;
  let description = null;
  let queries = null;
  let exampleResponse = null;
  let url = {};
  for (const key in endPToInsert) {
    url = key;
    for (const key2 in endPToInsert[key]) {
      if (key2 === "description") {
        description = endPToInsert[key][key2];
      }
      if (key2 === "queries") {
        queries = endPToInsert[key][key2];
      }
      if (key2 === "exampleResponse") {
        exampleResponse = endPToInsert[key][key2];
      }
    }
  }
  return fs.promises
    .readFile("endpoints.json", "utf-8")
    .then((endP) => {
      const parseEndP = JSON.parse(endP);
      if (description && queries && exampleResponse) {
  
          parseEndP[url] = endPToInsert[url];
          fs.writeFile("endpoints.json", JSON.stringify(parseEndP), (error) => {
            if (error) {
              return Promise.reject({ status: 400, msg: "Bad request" });
            } 

          });
          return endPToInsert;
      }
      return Promise.reject({ status: 400, msg: "Bad request" });
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};


module.exports = { selectEndpoints, insertEndpoint };
