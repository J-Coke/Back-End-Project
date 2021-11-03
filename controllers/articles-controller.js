const { fetchArticle, amendArticle } = require("../models/articles-model");

exports.getArticle = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticle(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next);
}

exports.patchArticle = (req, res, next) => {
    const { inc_votes } = req.body;
    const { article_id } = req.params;
    if (Object.keys(req.body).length > 1) {
        throw ({status: 400, msg: "Bad request, unrecognised input"})
    } else {
    amendArticle(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next);
    }
}
