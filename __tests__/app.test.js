const db = require('../db/index.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require("../app");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("not a route", () => {
    it("status 404, responds with error message of path not found", () => {
        return request(app)
            .get("/notARoute")
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("Path not found")
            })
    })
})

describe("GET /api/topics", () => {
    it("status 200, responds with an array of topics", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({body}) => {
                expect(body.topics.length).toBe(3);
                body.topics.forEach((topic) => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    )
                })
            })
    })
    it("status 404, responds with an error message of path not found when passed invalid path", () => {
        return request(app)
            .get("/api/topic")
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("Path not found")
            })
    })
})

describe("GET /api/articles/:article_id", () => {
    it("status 200, responds with a matching article when passed an article id", () => {
        const article_id = 1;
        return request(app)
            .get(`/api/articles/${article_id}`)
            .expect(200)
            .then(({body}) => {
                console.log(body)
                expect(body).toEqual({
                    article: [{
                    author: "butter_bridge",
                    title: "Living in the shadow of a great man",
                    article_id: 1,
                    body: "I find this existence challenging",
                    topic: "mitch",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100,
                    comment_count: "11"
                    }]})
            })
    })
    it("status 400, when passed invalid article_id", () => {
        const article_id = 'INVALID'
        return request(app)
            .get(`/api/articles/${article_id}`)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad request!")
            })
    })
    it("status 404, when passed valid article_id with no correspoding article", () => {
        const article_id = 999;
        return request(app)
            .get(`/api/articles/${article_id}`)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("Article not found")
            })
    })
})

describe("PATCH /api/articles/:article_id", () => {
    it("status 200, responds with updated article", () => {
        const article_id = 3
        const newVote = 99
        const patchObj = { inc_votes: newVote }
        return request(app)
            .patch(`/api/articles/${article_id}`)
            .send(patchObj)
            .expect(200)
            .then(({body}) => {
                expect(body).toEqual({
                    article: [{
                    author: "icellusedkars",
                    title: "Eight pug gifs that remind me of mitch",
                    article_id: 3,
                    body: "some gifs",
                    topic: "mitch",
                    created_at: "2020-11-03T09:12:00.000Z",
                    votes: 99,
                    }]})
            })
    })
    it("status 400, when passed invalid new_vote", () => {
        const article_id = 3
        const newVote = "cat"
        const patchObj = { inc_votes: newVote }
        return request(app)
            .patch(`/api/articles/${article_id}`)
            .send(patchObj)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad request!")
            })
    })
    it("status 400, when new_vote value is null", () => {
        const article_id = 3
        const newVote = 1
        const patchObj = { inc_votes: null }
        return request(app)
            .patch(`/api/articles/${article_id}`)
            .send(patchObj)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad request, input value missing")
            })
    })
    it("status 400, when new_vote missing", () => {
        const article_id = 3
        const patchObj = {}
        return request(app)
            .patch(`/api/articles/${article_id}`)
            .send(patchObj)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad request, input value missing")
            })
    })
    it("status 400, when patchObj incorrectly structured", () => {
        const article_id = 3
        const patchObj = { inc_votes : 1, name: 'Mitch' }
        return request(app)
            .patch(`/api/articles/${article_id}`)
            .send(patchObj)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad request, unrecognised input")
            })
    })
})

describe("GET /api/articles", () => {
    it("status 200, responds with an articles array of objects", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                console.log(articles, 'arts')
                expect(articles).toBeInstanceOf(Array);
                expect(articles).toHaveLength(12);
                articles.forEach((article) => {
                  expect(article).toEqual(
                    expect.objectContaining({
                      author: expect.any(String),
                      title: expect.any(String),
                      article_id: expect.any(Number),
                      topic: expect.any(String),
                      created_at: expect.any(String),
                      votes: expect.any(Number),
                      comment_count: expect.any(String)
                    })
                  );
                });
              });
    })
    it("status 200, responds with an articles array of articles with the topic cat", () => {
        return request(app)
            .get(`/api/articles?topic=cats`)
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toHaveLength(1);
                expect(articles[0].article_id).toEqual(5);
              });
    })
    it("status 200, responds with an articles array sorted by article_id and defaulting to descending", () => {
        return request(app)
            .get(`/api/articles?sort_by=article_id`)
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toHaveLength(12);
                expect(articles[0].article_id).toEqual(12);
                expect(articles[11].article_id).toEqual(1);
              });
    })
    it("status 200, responds with an articles array sorted in ascending order and defaulting to sort by date", () => {
        return request(app)
            .get(`/api/articles?order=ASC`)
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toHaveLength(12);
                expect(articles[0].article_id).toEqual(7);
                expect(articles[11].article_id).toEqual(3);
              });
    })
    it("status 200, responds with an articles array sorted and filtered by multiple queries", () => {
        return request(app)
            .get(`/api/articles?topic=mitch&sort_by=title&order=ASC`)
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toHaveLength(11);
                expect(articles[0].article_id).toEqual(6);
                expect(articles[10].article_id).toEqual(7);
              });
    })
    it("status 400, responds with Invalid sort query when sort column does not exist", () => {
        return request(app)
            .get(`/api/articles?sort_by=wrongColumn`)
            .expect(400)
            .then(({body}) => {
                console.log(body)
                expect(body.msg).toBe("Invalid sort query");
              });
    })
    it("status 400, responds with Invalid order query when something other than asc or desc is passed", () => {
        return request(app)
            .get(`/api/articles?order=incorrect`)
            .expect(400)
            .then(({body}) => {
                console.log(body)
                expect(body.msg).toBe("Invalid order query");
              });
    })
    it("status 200, responds with empty array when passed valid topic that has no articles associated", () => {
        return request(app)
            .get(`/api/articles?topic=paper`)
            .expect(200)
            .then(({body}) => {
                console.log(body)
                const { articles } = body;
                expect(articles).toEqual([]);
            })
    })
    it("status 404, responds with Invalid topic when passed invalid topic", () => {
        return request(app)
            .get(`/api/articles?topic=invalid`)
            .expect(404)
            .then(({body}) => {
                console.log(body)
                expect(body.msg).toBe("Invalid topic");
            })
    })
})

describe.only("GET /api/articles/:article_id/comments", () => {
    it("status 200, responds with array of comment objects for particular article", () => {
        const article_id = 1;
        return request(app)
            .get(`/api/articles/${article_id}/comments`)
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                console.log(comments, 'comms')
                expect(comments).toBeInstanceOf(Array);
                expect(comments).toHaveLength(11);
                comments.forEach((comment) => {
                  expect(comment).toEqual(
                    expect.objectContaining({
                      comment_id: expect.any(Number),
                      votes: expect.any(Number),
                      created_at: expect.any(String),
                      author: expect.any(String),
                      body: expect.any(String),
                    })
                  );
                });
              });
    })
    it("status 400, responds with Invalid article id when passed invalid ", () => {
        const article_id = 'cat';
        return request(app)
            .get(`/api/articles/${article_id}/comments`)
            .expect(400)
            .then(({body}) => {
                console.log(body)
                expect(body.msg).toBe("Bad request!");
              });
    })
    it("status 200, responds with empty array when passed valid article_id that has no comments", () => {
        const article_id = 2;
        return request(app)
            .get(`/api/articles/${article_id}/comments`)
            .expect(200)
            .then(({body}) => {
                console.log(body)
                const {comments} = body
                expect(comments).toEqual([]);
              });
    })
    it("status 204, responds with No content when passed valid article_id that has no article attached", () => {
        const article_id = 999;
        return request(app)
            .get(`/api/articles/${article_id}/comments`)
            .expect(404)
            .then(({body}) => {
                console.log(body)
                expect(body.msg).toEqual('Not found');
              });
    })
})

describe("post /api/articles/:article_id/comments", () => {
    it("status 200, responds with posted comment", () => {
        const article_id = 8
        const newComment = {
            author: "butter_bridge",
            body: 'I was not proud of what I had learned but I never doubted that it was worth knowing.'
        }
        return request(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .expect(200)
            .then(({body}) => {
                const {comment} = body
                console.log(comment, "test332")
                expect(comment).toEqual([{
                    comment_id: 19,
                    article_id: 8,
                    votes: 0,
                    created_at: expect.any(String),
                    ...newComment,
                }])
            })
    })
    it("status 404, returns Article not found if valid article_id doesn't exist", () => {
        const article_id = 999
        const newComment = {
            author: "butter_bridge",
            body: 'I was not proud of what I had learned but I never doubted that it was worth knowing.'
        }
        return request(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .expect(404)
            .then(({body}) => {
                console.log(body)
                expect(body.msg).toBe("Article not found");
              });
    })
    it("status 400, returns Bad Request! if invalid article_id is passed", () => {
        const article_id = 'cat'
        const newComment = {
            author: "butter_bridge",
            body: 'I was not proud of what I had learned but I never doubted that it was worth knowing.'
        }
        return request(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .expect(400)
            .then(({body}) => {
                console.log(body)
                expect(body.msg).toBe("Bad request!");
              });
    })
    it("status 400, returns Bad request, input value missing if author data is missing", () => {
        const article_id = 8
        const newComment = {
            author: null,
            body: 'I was not proud of what I had learned but I never doubted that it was worth knowing.'
        }
        return request(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .expect(400)
            .then(({body}) => {
                console.log(body)
                expect(body.msg).toBe("Bad request, input value missing");
              });
        
    })
    it("status 400, returns Bad request, input value missing if body data is missing", () => {
        const article_id = 8
        const newComment = {
            author: "butter_bridge",
            body: null
        }
        return request(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .expect(400)
            .then(({body}) => {
                console.log(body)
                expect(body.msg).toBe("Bad request, input value missing");
              });
        
    })
    it("status 400, returns Bad request! if article_id data is missing", () => {
        const article_id = null
        const newComment = {
            author: "butter_bridge",
            body: 'I was not proud of what I had learned but I never doubted that it was worth knowing.'
        }
        return request(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .expect(400)
            .then(({body}) => {
                console.log(body)
                expect(body.msg).toBe("Bad request!");
              });
        
    })
    it("status 400, returns Bad request! if article_id data is missing", () => {
        const article_id = null
        const newComment = {
            author: "butter_bridge",
            body: 'I was not proud of what I had learned but I never doubted that it was worth knowing.'
        }
        return request(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .expect(400)
            .then(({body}) => {
                console.log(body)
                expect(body.msg).toBe("Bad request!");
              });
        
    })
    it("status 400, returns Bad request, input value missing if author data is empty string", () => {
        const article_id = 8
        const newComment = {
            author: "",
            body: 'I was not proud of what I had learned but I never doubted that it was worth knowing.'
        }
        return request(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .expect(400)
            .then(({body}) => {
                console.log(body)
                expect(body.msg).toBe("Bad request, input value missing");
              });
        
    })
    it("status 400, returns Bad request, input value missing if body data is empty string", () => {
        const article_id = 8
        const newComment = {
            author: "butter_bridge",
            body: ""
        }
        return request(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .expect(400)
            .then(({body}) => {
                console.log(body)
                expect(body.msg).toBe("Bad request, input value missing");
              });
        
    })
})

describe("delete /api/comments/:comment_id", () => {
    it("status 204, responds with no content", () => {
        const comment_id = 1
        
        return request(app)
            .delete(`/api/comments/${comment_id}`)
            .expect(204)
    })
    it("status 404, responds comment not found when passed valid but non existant comment_id", () => {
        const comment_id = 999
        
        return request(app)
            .delete(`/api/comments/${comment_id}`)
            .expect(404)
            .then(({body}) => {
                // const {content} = body
                console.log(body, "content")
                expect(body.msg).toBe('Comment not found')
            })
    })
    it("status 400, responds with Bad request! when passed invalid comment_id", () => {
        const comment_id = 'cat'
        
        return request(app)
            .delete(`/api/comments/${comment_id}`)
            .expect(400)
            .then(({body}) => {
                // const {content} = body
                console.log(body, "content")
                expect(body.msg).toBe('Bad request!')
            })
    })
})

describe("GET /api", () => {
    it("status 200, responds with JSON file", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({text}) => {
                console.log(typeof text, 'bod bod')
                expect(typeof JSON.stringify(text)).toBe("string")
            })
    })
})