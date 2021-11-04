const articlesRouter = require("express").Router();
const { getArticle, patchArticle, getArticles } = require("../controllers/articles-controller.js");
console.log('in art router')
articlesRouter.get("/:article_id", getArticle);
articlesRouter.patch("/:article_id", patchArticle);
articlesRouter.get("", getArticles);

module.exports = articlesRouter;