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

describe.only("GET /api/articles", () => {
    it("status 200, responds with an articles array of objects", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
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
})