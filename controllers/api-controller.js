const { fetchAllEndpoints } = require("../models/api-model");


exports.getAllEndpoints = (req, res, next) => {
    // const { comment_id } = req.params;
    fetchAllEndpoints()
    .then((contents) => {
        console.log(contents, 'content cont')
        res.status(200).send(contents)
    })
    .catch(next);
}