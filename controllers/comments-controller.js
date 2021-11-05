const { eraseComment } = require("../models/comments-model");
console.log('in comment cont')

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    eraseComment(comment_id)
    .then((content) => {
        console.log(content, 'content cont')
        res.status(204).send({content})
    })
    .catch(next);
}