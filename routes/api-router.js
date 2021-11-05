const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");


apiRouter.use("/topics", topicsRouter);
// apiRouter.use("/comments", commentsRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;