const express = require("express");
const { handleCustomErrors, handle500Errors, handlePsqlErrors } = require("./errors.js");
const apiRouter = require("./routes/api-router.js");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Path not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500Errors);

module.exports = app;