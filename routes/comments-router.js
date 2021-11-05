const commentsRouter = require("express").Router();
const { deleteComment } = require("../controllers/comments-controller.js");
console.log('in comment router')
commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;