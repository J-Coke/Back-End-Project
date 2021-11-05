const { fetchArticle, amendArticle, fetchArticles, fetchArticleComments, sendArticleComment } = require("../models/articles-model");

exports.getArticle = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticle(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next);
}

exports.patchArticle = (req, res, next) => {
    console.log(req)
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

exports.getArticles = (req, res, next) => {
    const queries = req.query;
    fetchArticles(queries)
    .then((articles) => {
        console.log({articles}, "articles")
        res.status(200).send({articles})
    })
    .catch(next);
}

exports.getArticleComments = (req, res, next) => {
    console.log(req.params, 'req')
    const { article_id } = req.params;
    fetchArticleComments(article_id)
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next);
}

exports.postArticleComment = (req, res, next) => {
    const { article_id } = req.params;
    const { author, body } = req.body
    sendArticleComment(article_id, author, body)
    .then((comment) => {
        res.status(200).send({comment})
    })
    .catch(next);
}