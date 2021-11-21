const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticle,
  getArticles,
  getArticleComments,
  postArticleComment,
} = require("../controllers/articles-controller.js");

articlesRouter.get("", getArticles);
articlesRouter.get("/:article_id", getArticle);
articlesRouter.patch("/:article_id", patchArticle);
articlesRouter.get("/:article_id/comments", getArticleComments);
articlesRouter.post("/:article_id/comments", postArticleComment);

module.exports = articlesRouter;
