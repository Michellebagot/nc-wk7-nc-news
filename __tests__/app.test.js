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
