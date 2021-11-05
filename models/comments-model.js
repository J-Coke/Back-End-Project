const db = require('../db');
console.log('in comment model')



exports.fetchArticleComments = (article_id) => {
    console.log(article_id)
    return db.query(`
        SELECT articles.*,
        COUNT (comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id
        ;`, [article_id])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' })
            } else {
                return rows
            }
        })
}