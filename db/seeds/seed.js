const db = require('../');
const format = require('pg-format');
const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE topics (
          slug VARCHAR PRIMARY KEY,
          description VARCHAR
        );`)
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          username VARCHAR PRIMARY KEY,
          avatar_url VARCHAR,
          name VARCHAR
        );`)
    })
    .then(() => {
      return db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          body TEXT NOT NULL,
          votes INT DEFAULT 0,
          topic VARCHAR NOT NULL REFERENCES topics(slug),
          author VARCHAR NOT NULL REFERENCES users(username),
          created_at TIMESTAMP NOT NULL
        );`)
    })
    .then(() => {
      return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          author VARCHAR NOT NULL REFERENCES users(username),
          article_id INT NOT NULL REFERENCES articles(article_id),
          votes INT DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          body TEXT NOT NULL
        );`)
    })
    .then(() => {
      const topicInput = format(
        `INSERT INTO topics
        (slug, description)
        VALUES
        %L RETURNING *;`,
        topicData.map((topic) => {
          return [
            topic.slug,
            topic.description
          ]
        })
      )
      return db.query(topicInput)
    })
    .then(() => {
      const userInput = format(
        `INSERT INTO users
        (username, avatar_url, name)
        VALUES
        %L RETURNING *;`,
        userData.map((user) => {
          return [
            user.username,
            user.avatar_url,
            user.name
          ]
        })
      )
      return db.query(userInput)
    })
    .then(() => {
      const articleInput = format(
        `INSERT INTO articles
        (title, body, votes, topic, author, created_at)
        VALUES
        %L RETURNING *;`,
        articleData.map((article) => {
          return [
            article.title,
            article.body,
            article.votes,
            article.topic,
            article.author,
            article.created_at
          ]
        })
      )
      return db.query(articleInput)
    })
    .then(() => {
      const commentInput = format(
        `INSERT INTO comments
        (author, article_id, votes, created_at, body)
        VALUES
        %L RETURNING *;`,
        commentData.map((comment) => {
          return [
            comment.author,
            comment.article_id,
            comment.votes,
            comment.created_at,
            comment.body
          ]
        })
      )
      return db.query(commentInput)
    })
};

module.exports = seed;
