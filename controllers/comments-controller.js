const { fetchArticleComments } = require("../models/comments-model");
console.log('in comment cont')

exports.getArticleComments = (req, res, next) => {
    console.log(req.params, 'req')
    const { article_id } = req.params;
    fetchArticleComments(article_id)
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next);
}