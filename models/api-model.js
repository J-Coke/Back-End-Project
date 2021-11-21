const db = require("../db");
const { promises: fs } = require("fs");

exports.fetchAllEndpoints = async () => {
  const fileContents = await fs.readFile("NC-news-endpoints.json", "utf-8");

  return fileContents;
};
