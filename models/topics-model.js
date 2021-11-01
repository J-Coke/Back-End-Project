const db = require('../db');

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`)
        .then(({rows}) => rows);
}