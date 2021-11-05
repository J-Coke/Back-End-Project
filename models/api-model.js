const db = require('../db');
const { promises: fs } = require("fs")
console.log('in api model')

exports.fetchAllEndpoints = async () => {
    const fileContents = await fs.readFile("NC-news-endpoints.json", "utf-8")

    console.log(fileContents)

    return fileContents
}