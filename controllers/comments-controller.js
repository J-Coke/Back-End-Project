const { eraseComment } = require("../models/comments-model");
console.log('in comment cont')

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    eraseComment(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch(next);
}