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

describe("Task 5 - GET /api/articles", () => {
  test("should expect a response with 13 articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles.length).toBe(13);
      });
  });
  test("should expect the response to include appropriate headings excluding body!", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("should return in date descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("Task 6 - GET /api/articles/:article_id/comments", () => {
  test("should return an array of objects with the appropriate properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments.length).not.toBe(0);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("should return an array that is sorted by the newest article first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("should return a 200 if no comments exist for the article", () => {
    return request(app)
      .get("/api/articles/10/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });
  test("should return a status code of 400 if passed an invalid id", () => {
    return request(app)
      .get("/api/articles/nonexistantID/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("should return a status code of 404 if passed an article_id that does not exist", () => {
    return request(app)
      .get("/api/articles/75/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});

describe("Task 7 - POST /api/articles/:article_id/comments", () => {
  test("should add a new comment to an article, returning the comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is some placeholder text to replicate adding a comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body;
        expect(comment.comment).toEqual({
          article_id: expect.any(Number),
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        });
      });
  });
  test("should fail to post the comment if provided a valid but non existant article ID", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is some placeholder text to replicate adding a comment",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("should fail to post the comment if provided with an invalid article ID", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is some placeholder text to replicate adding a comment",
    };
    return request(app)
      .post("/api/articles/nonExistantID/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("should fail to post if the comment body is blank", () => {
    const newComment = {
      username: "butter_bridge",
      body: "",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("should fail to post if the comment no username is supplied", () => {
    const newComment = {
      username: "",
      body: "This is some placeholder text to replicate adding a comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
