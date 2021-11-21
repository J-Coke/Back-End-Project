const db = require("../db");

exports.eraseComment = async (comment_id) => {
  const queryParams = [comment_id];
  const { rows } = await db.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
    ;`,
    queryParams
  );

  if (rows.length === 0) {
    throw { status: 404, msg: "Comment not found" };
  } else {
    return rows;
  }
};
