const { fetchAllEndpoints } = require("../models/api-model");


exports.getAllEndpoints = (req, res, next) => {
    // const { comment_id } = req.params;
    fetchAllEndpoints()
    .then((content) => {
        console.log(content, 'content cont')
        res.status(204).send({content})
    })
    .catch(next);
}