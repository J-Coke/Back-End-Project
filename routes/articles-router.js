const articlesRouter = require("express").Router();
const { getArticle } = require("../controllers/articles-controller.js");
console.log('in art router')
articlesRouter.get("/", getArticle);

module.exports = articlesRouter;