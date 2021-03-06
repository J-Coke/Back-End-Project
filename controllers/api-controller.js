const { fetchAllEndpoints } = require("../models/api-model");

exports.getAllEndpoints = (req, res, next) => {
  fetchAllEndpoints()
    .then((contents) => {
      res.status(200).send(contents);
    })
    .catch(next);
};
