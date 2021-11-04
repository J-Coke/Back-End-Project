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

exports.fetchArticles = async (queries) => {
    const {topic} = queries;
    const {sort_by} = queries;
    const {order} = queries;

    let queryStr = 'SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT (comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id'
    let queryParams = []

    if (topic) {
        queryStr += ` WHERE articles.topic = $1`
        queryParams.push(topic)
    }
    queryStr += ' GROUP BY articles.article_id'
    
    // if (sort_by && !['author', 'title', 'article_id', 'topic', 'created_at', 'votes'].includes(sort_by)) {
    //     throw ({ status: 400, msg: 'Invalid sort query' })
    // }
    if (sort_by) {
        if (['author', 'title', 'article_id', 'topic', 'created_at', 'votes'].includes(sort_by)) {
            queryStr += ` ORDER BY articles.${sort_by}`
        } else {
            throw ({ status: 400, msg: 'Invalid sort query' })
        }
    } else {
        queryStr += ` ORDER BY articles.created_at`
    }

    if (order) {
        if (['ASC', 'asc', 'DESC', 'desc'].includes(order)) {
            queryStr += ` ${order}`
        } else {
            throw ({ status: 400, msg: 'Invalid order query' })
        }
    } else {
        queryStr += ` DESC`
    }
    
    console.log(queryStr, queryParams, 'q p')
    const {rows} = await db.query(queryStr, queryParams)

    if (rows.length === 0) {
        const result = await db.query(`
        SELECT * FROM topics WHERE slug = $1`, [topic])
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Invalid topic' })
        }
    }

    return rows
        // .then(({rows}) => {
        //     console.log(rows)
        //     if (rows.length === 0) {
        //         return Promise.reject({ status: 404, msg: 'Invalid topic' })
        //     } else {
        //         return rows
        //     }
        // })
}