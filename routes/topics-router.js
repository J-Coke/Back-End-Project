const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics-controller.js");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;