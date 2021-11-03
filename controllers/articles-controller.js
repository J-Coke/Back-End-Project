const { fetchArticle } = require("../models/articles-model");

exports.getArticle = (req, res, next) => {
    const { article_id } = req.query;
    fetchArticle(article_id)
    .then((article) => {
        console.log(article,  'artic')
        res.status(200).send({article})
    })
    .catch(next);
}