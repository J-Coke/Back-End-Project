\c nc_news_test

UPDATE articles
SET
    votes = votes + 1
WHERE article_id = 3
RETURNING *;