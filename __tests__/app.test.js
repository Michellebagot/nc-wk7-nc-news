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
      .get("/api/articles/invaideArticleID")
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
  test("Task 12 - should include comment count", () => {
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
          comment_count: expect.any(Number),
        });
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
      .get("/api/articles/invalidArticleID/comments")
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
      .post("/api/articles/invalidArticleID/comments")
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

describe("Task 8 - PATCH /api/articles/:article_id", () => {
  test("should update the votes by adding votes on the selected article", () => {
    const updateVotes = { inc_votes: 123 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.votes).toEqual(223);
        expect(article.article_id).toEqual(1);
      });
  });
  test("should update the votes by subtracting negative votes on the selected article", () => {
    const updateVotes = { inc_votes: -50 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.votes).toEqual(50);
        expect(article.article_id).toEqual(1);
      });
  });
  test("should return the article with the updated votes when passed a valid request", () => {
    const updateVotes = { inc_votes: 123 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(200)
      .then((response) => {
        const article = response.body.article;
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
  test("should return a 400 status if passed no votes to update", () => {
    //unsure if this is the right status code
    const updateVotes = { inc_votes: 0 };
    return request(app)
      .patch("/api/articles/2")
      .send(updateVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("should return a 400 error if the article_id is invalid", () => {
    const updateVotes = { inc_votes: 123 };
    return request(app)
      .patch("/api/articles/invalidArticleID")
      .send(updateVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("should return a 404 error if the article_id is ", () => {
    const updateVotes = { inc_votes: 123 };
    return request(app)
      .patch("/api/articles/9999")
      .send(updateVotes)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});

describe("Task 9 - DELETE /api/comments/:comment_id", () => {
  test('should respond with 204 and "no content" when sucessfully deleted a comment', () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("should respond with 400 when passed an invalid ID", () => {
    return request(app).delete("/api/comments/invalidId").expect(400);
  });
  test("should respond with 404 when passed an non existant ID", () => {
    return request(app).delete("/api/comments/9999").expect(404);
  });
  test("should respond with 404 when passed no id", () => {
    return request(app).delete("/api/comments/").expect(404);
  });
});

describe("Task 10 - GET /api/users", () => {
  test("should return with an array", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body;
        expect(users).toBeInstanceOf(Array);
      });
  });
  test("should return with an array of users which has a length greater than 0", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body;
        expect(users.length).not.toBe(0);
      });
  });
  test("should return with an array of users who's objects match the required properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body;
        expect(users.length).not.toBe(0);
        users.map((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("Task 11 - GET /api/articles (topic query)", () => {
  test("should return all the articles with the queried topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles.length).not.toBe(0);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
          expect(article.topic).toEqual("mitch");
        });
      });
  });
  test("should return 404 not found when querying topics with an invalid topic", () => {
    return request(app)
      .get("/api/articles?topic=invalidTopic")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("should return all articles when a topic is omitted", () => {
    return request(app)
      .get("/api/articles?topic=")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles.length).not.toBe(0);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
});

describe("Task 15 /api/articles - sorting queries ", () => {
  test("should sort articles by any valid column, defaulting to a decending order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("article_id", {
          descending: true,
        });
      });
  });
  test("should allow for the sort order to be ascending or decending", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order_by=asc")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("title", {
          ascending: true,
        });
      });
  });
  test("should return 400 bad request if given an invalid sort_by column", () => {
    //same
    return request(app).get("/api/articles?sort_by=invalid").expect(400);
  });
});

describe("Task 17 - GET /api/users/:username", () => {
  test("should return a user by their username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then((response) => {
        const user = response.body;
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
  });
  test("should return 200 and empty response if the username does not exist", () => {
    return request(app)
      .get("/api/users/nonExistantUser")
      .expect(200)
      .then((response) => {
        const user = response.body;
        expect(user).toEqual({});
      });
  });
});

describe("Task 18 - PATCH /api/comments/:comment_id", () => {
  test("should update the votes, positively on the comment from the supplied comment id", () => {
    const updateVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(updateVotes)
      .expect(200)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.votes).toEqual(17);
      });
  });
  test("should update the votes, negatively on the comment from the supplied comment id", () => {
    const updateVotes = { inc_votes: -1 };
    return request(app)
      .patch("/api/comments/1")
      .send(updateVotes)
      .expect(200)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.votes).toEqual(15);
      });
  });
  test("should return the whole comment upon completion", () => {
    const updateVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(updateVotes)
      .expect(200)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment).toEqual({
          article_id: expect.any(Number),
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        });
      });
  });
  test("should still respond with the comment if the votes are not incremented", () => {
    const updateVotes = { inc_votes: 0 };
    return request(app)
      .patch("/api/comments/1")
      .send(updateVotes)
      .expect(200)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment).toEqual({
          article_id: expect.any(Number),
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        });
      });
  });
  test("should respond with 404 when passed no id", () => {
    return request(app).patch("/api/comments/").expect(404);
  });

  test("should respond with 400 when passed an invalid ID", () => {
    return request(app).patch("/api/comments/invalidId").expect(400);
  });
  test("should respond with 404 when passed an non existant ID", () => {
    return request(app).patch("/api/comments/9999").expect(404);
  });
});

