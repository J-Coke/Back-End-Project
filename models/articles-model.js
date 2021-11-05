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
    
    const {rows} = await db.query(queryStr, queryParams)

    if (rows.length === 0 && topic) {
        const result = await db.query(`
        SELECT * FROM topics WHERE slug = $1`, [topic])
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Invalid topic' })
        }
    }

    return rows
}

exports.fetchArticleComments = async (article_id) => {
    console.log(article_id)
    const queryStr = `
    SELECT comment_id, votes, created_at, author, body
    FROM comments
    WHERE article_id = $1
    ;`
    const queryParams = [article_id]

    const {rows} = await db.query(queryStr, queryParams)
    console.log(rows, 'rows')
    if (rows.length === 0 && article_id) {
        const result = await db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        console.log(result.rows, 'resultrows')
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Not found' })
        }
    }

    return rows
}

exports.sendArticleComment = async (article_id, author, body) => {

    const queryStr1 = `
    INSERT INTO users
        (username)
    VALUES
        ($1)
    RETURNING *
    ;`
    const queryStr2 = `
    INSERT INTO comments
        (article_id, author, body)
    VALUES
        ($1, $2, $3)
    RETURNING *
    ;`
    const queryStr3 = `SELECT * FROM users WHERE username = $1`
    const queryParams1 = [author]
    const queryParams2 = [article_id, author, body]
    const queryParams3 = [author]

    const userNew = await db.query(queryStr3, queryParams3)
    console.log(userNew, 'usernew')
    if (userNew.rows.length === 0) {
        await db.query(queryStr1, queryParams1)
    }

    const {rows} = await db.query(queryStr2, queryParams2)
    return rows
}