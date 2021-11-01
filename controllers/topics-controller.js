const { fetchTopics } = require("../models/topics-model");

exports.getTopics = (req, res, next) => {
    console.log("in controller");
    fetchTopics()
    .then((result) => {
            res.status(200).send({ topics: result })
        })
}