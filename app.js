const express = require("express");
// const { handleCustoms, handle500s, handlePsqlErrors } = require("./errors.js");
const apiRouter = require("./routes/api-router.js");

const app = express();

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "path not found" });
});

// app.use(handleCustoms);
// app.use(handlePsqlErrors);
// app.use(handle500s);

module.exports = app;