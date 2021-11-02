const db = require('../db');
console.log('in model')



exports.fetchArticle = (article_id) => {
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
            return rows
            
        })
    }