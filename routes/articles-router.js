const articlesRouter = require("express").Router();
const { getArticle, patchArticle, getArticles, getArticleComments } = require("../controllers/articles-controller.js");
console.log('in art router')
articlesRouter.get("", getArticles);
articlesRouter.get("/:article_id", getArticle);
articlesRouter.patch("/:article_id", patchArticle);
articlesRouter.get("/:article_id/comments", getArticleComments);


module.exports = articlesRouter;