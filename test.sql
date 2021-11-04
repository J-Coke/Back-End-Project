\c nc_news_test;

SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,
COUNT (comments.comment_id) AS comment_count
FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id
GROUP BY articles.article_id;

-- , title, article_id, topic, created_at, votes, comment_count,