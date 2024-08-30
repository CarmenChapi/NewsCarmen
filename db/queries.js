


exports.querySelectTopics = 
`SELECT *
FROM topics ;`;

exports.querySelectArticles =
`SELECT articles.article_id, articles.title, articles.topic, articles.author, 
articles.created_at, articles.votes, articles.article_img_url,
COUNT(comments.comment_id) AS comment_count
FROM articles 
LEFT JOIN comments ON 
articles.article_id = comments.article_id 
`;




exports.querySelectArticlesById = 
`SELECT articles.article_id, articles.title, articles.topic, articles.author, 
articles.created_at, articles.votes, articles.article_img_url, articles.body,
COUNT(comments.comment_id) AS comment_count
FROM articles 
LEFT JOIN comments ON 
articles.article_id = comments.article_id 
WHERE articles.article_id = $1 
GROUP BY articles.article_id;`

exports.querySelectComment = 
`SELECT *
FROM comments ; `

exports.querySelectCommentById = 
`SELECT *
FROM comments 
WHERE comment_id = $1 ; `

exports.querySelectCommentsByArticleId = 
`SELECT *
FROM comments 
WHERE article_id = $1 
ORDER BY created_at DESC ;`

exports.queryInsertComment = 
`INSERT INTO comments(
    author, body, votes, article_id
    ) VALUES ((SELECT username
               FROM users
               WHERE username = $1), $2, $3, (SELECT article_id
                                              FROM articles 
                                              WHERE article_id = $4)) RETURNING *;` ;

exports.queryUpdateArticlesByIdSum = 
`UPDATE articles
SET votes = votes + $1
WHERE article_id = $2 
RETURNING *;`;

exports.queryUpdateArticlesByIdNeg = 
`UPDATE articles
SET votes = votes - $1
WHERE article_id = $2 
RETURNING *;`;

exports.queryDeleteCommentById = 
`DELETE FROM comments
WHERE comment_id = $1 
 RETURNING *;`;
 
 exports.querySelectUsers = 
 `SELECT *
 FROM users ;`