const db = require("../db");

exports.fetchUsers = () => {
  return db.query(`SELECT username FROM users;`).then(({ rows }) => rows);
};

exports.fetchUser = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        throw { status: 404, msg: "User not found" };
      } else {
        return rows;
      }
    });
};
