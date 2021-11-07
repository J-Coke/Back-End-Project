const db = require('../db');

exports.fetchUsers = () => {
    return db.query(`SELECT username FROM users;`)
        .then(({rows}) => rows);
}