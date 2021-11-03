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

describe("GET /api/articles?article_id=", () => {
    it.only("status 200, responds with a matching article when passed an article id", () => {
        const article_id = 1;
        return request(app)
            .get(`/api/articles?article_id=${article_id}`)
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
    it.only("status 400, when passed invalid article_id", () => {
        const article_id = 'INVALID'
        return request(app)
            .get(`/api/articles?article_id=${article_id}`)
            .expect(400)
            .then(({body}) => {
                console.log(body)
                expect(body.msg).toBe("Invalid query")
            })
    })
})