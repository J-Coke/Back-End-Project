const commentsRouter = require("express").Router();
const { getArticleComments } = require("../controllers/comments-controller.js");
console.log('in comment router')
commentsRouter.get("", getArticleComments);

module.exports = commentsRouter;