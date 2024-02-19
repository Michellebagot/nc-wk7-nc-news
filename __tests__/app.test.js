const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Task 2 - GET /api/topics ", () => {
  test("should expect a 200 response - a simple starter test", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("should expect a response with 3 topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(topics.length).toBe(3);
      });
  });
  test("should expect the response to include slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("Task 3 - GET /api", () => {
  test("should return an object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpoint = response.body.endpoints;
        expect(endpoint).toBeInstanceOf(Object);
      });
  });
  test("should return an object containing all the available API endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpoint = response.body.endpoints;
        expect(endpoint).toEqual(endpoints);
      });
  });
});

describe("Task 4 - GET /api/articles/:article_id", () => {
  test("should return an article object based on the ID passed into it", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article[0];
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("should return a status code of 400 if passed an invalid id", () => {
    return request(app)
      .get("/api/articles/nonexistantID")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("should return a status code of 404 if passed an valid id that does no exist", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});
