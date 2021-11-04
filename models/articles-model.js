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
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' })
            } else {
                return rows
            }
        })
}

exports.amendArticle = (article_id, inc_votes) => {
    return db.query(`
        UPDATE articles
        SET
            votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
        `, [inc_votes, article_id])
        .then(({rows}) => {
            return rows
        })
}

exports.fetchArticles = () => {
    return db.query(`
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,
    COUNT (comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id;
    `)
        .then(({rows}) => {
            console.log(rows)
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' })
            } else {
                return rows
            }
        })
}