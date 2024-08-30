const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("Project Test Suite", () => {
  describe("Test topics", () => {
    test("200 get all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((data) => {
          expect(Array.isArray(data.body.topics)).toBe(true);
          expect(data.body.topics.length === 3).toBe(true);
          data.body.topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
        });
    });
  });
  describe("Test endpoints", () => {
    test("200: GET /api all endpoints and descriptions", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((data) => {
          expect(Array.isArray(data.body.endpoints)).toBe(true);
          expect(data.body.endpoints[0]).toEqual({
            description:
              "serves up a json representation of all the available endpoints of the api",
          });
        });
    });
    const articleToPost = {
      "GET /api/articles/:article_id": {
        description: "return the article with id = article_id",
        queries: [],
        exampleResponse: {
          article: [
            {
              article_id: 1,
              title: "Eight pug gifs that remind me of mitch",
              topic: "mitch",
              author: "icellusedkars",
              created_at: "2020-11-03T09:12:00.000Z",
              votes: 0,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              comment_count: "2",
            },
          ],
        },
      },
    };
    test("201: POST /api/post insert new endpoint and description on endpoints.json", () => {
      return request(app) 
        .post("/api")
        .send(articleToPost)
        .expect(201)
        .then((response) => {
          const { body } = response;
          expect(body.endpoint).toEqual(articleToPost);
        });
    });

    test("201: POST /api/post update values when post a existing url endpoint", () => {
      return request(app)
        .post("/api")
        .send(articleToPost)
        .expect(201)
        .then((response) => {
          const { body } = response;
          console.log(Object.keys(body.endpoint))
          expect(Object.keys(body.endpoint)).toEqual(Object.keys(articleToPost));
        });
    });

    test("400: /api/post respond with a error msg when try to post a object without the properties: description, queries and exampleResponse ", () => {
      return request(app)
        .post("/api")
        .send({
          "/api/topics5": {
            description: "serves an array of all topics, exampole",
            exampleResponse: {
              topics: [{ slug: "football", aaaa: "Fo333333otie!" }],
            },
          },
        })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("Test articles", () => {
    describe("GET", () => {
      test("200: GET /api/articles return all articles in array, desc order by date", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((data) => {
            expect(Array.isArray(data.body.articles)).toBe(true);
            expect(data.body.articles.length).toBe(13);
            expect(data.body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
            data.body.articles.forEach((article) => {
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("article_id");
              expect(article).not.toHaveProperty("body");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("article_img_url");
              expect(article).toHaveProperty("comment_count");
            });
          });
      });
      test("200: GET /api/articles/:article_id article by id provided in the url", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((data) => {
            const articleToCompare = {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              body: "I find this existence challenging",
              comment_count: "11",
            };
            expect(data.body.article).toEqual(articleToCompare);
          });
      });

      test("404: GET /api/articles/:article_id return a error msg when the id passed is in the range but does not exist", () => {
        return request(app)
          .get("/api/articles/677")
          .expect(404)
          .then((data) => {
            expect(data.body.msg).toBe("Not found");
          });
      });

      test("400: GET /api/articles/:article_id return a error msg when the id passed is out of the range", () => {
        return request(app)
          .get("/api/articles/bizcocho")
          .expect(400)
          .then((data) => {
            expect(data.body.msg).toBe("Bad request");
          });
      });
      test("200: GET /api/articles?sort_by=nameColumn return all articles under the query sort_by any valid column(created_at by default)", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then((data) => {
            expect(Array.isArray(data.body.articles)).toBe(true);
            expect(data.body.articles.length).toBe(13);
            expect(data.body.articles).toBeSortedBy("votes", {
              descending: true,
            });
            data.body.articles.forEach((article) => {
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("article_id");
              expect(article).not.toHaveProperty("body");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("article_img_url");
              expect(article).toHaveProperty("comment_count");
            });
          });
      });

      test("200: GET /api/articles?order=asc o desc return all articles ordered asc or desc by the query value", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then((data) => {
            expect(Array.isArray(data.body.articles)).toBe(true);
            expect(data.body.articles.length).toBe(13);
            expect(data.body.articles).toBeSortedBy("created_at", {
              descending: false,
            });
            data.body.articles.forEach((article) => {
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("article_id");
              expect(article).not.toHaveProperty("body");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("article_img_url");
              expect(article).toHaveProperty("comment_count");
            });
          });
      });

      test("200: GET /api/articles?order=asc o desc return all articles by defalut query values when the query is invalid", () => {
        return request(app)
          .get("/api/articles?sorted_by=234")
          .expect(200)
          .then((data) => {
            expect(Array.isArray(data.body.articles)).toBe(true);
            expect(data.body.articles.length).toBe(13);
            expect(data.body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
            data.body.articles.forEach((article) => {
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("article_id");
              expect(article).not.toHaveProperty("body");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("article_img_url");
              expect(article).toHaveProperty("comment_count");
            });
          });
      });

      test("200: GET /api/articles?order=asc o desc return all articles by defalut query values when the query is invalid", () => {
        return request(app)
          .get("/api/articles?order=inverse")
          .expect(200)
          .then((data) => {
            expect(Array.isArray(data.body.articles)).toBe(true);
            expect(data.body.articles.length).toBe(13);
            expect(data.body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
            data.body.articles.forEach((article) => {
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("article_id");
              expect(article).not.toHaveProperty("body");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("article_img_url");
              expect(article).toHaveProperty("comment_count");
            });
          });
      });

      test("200: GET /api/articles?order=asc o desc return all articles ordered asd or desc by the query value", () => {
        return request(app)
          .get("/api/articles?order=hello")
          .expect(200)
          .then((data) => {
            expect(Array.isArray(data.body.articles)).toBe(true);
            expect(data.body.articles.length).toBe(13);
            expect(data.body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
            data.body.articles.forEach((article) => {
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("article_id");
              expect(article).not.toHaveProperty("body");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("article_img_url");
              expect(article).toHaveProperty("comment_count");
            });
          });
      });

      test("200: GET /api/articles?topic= [mitch, paper, cats] return all articles filtered by topic slug", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then((data) => {
            expect(Array.isArray(data.body.articles)).toBe(true);
            expect(data.body.articles.length).toBe(12);
            data.body.articles.forEach((article) => {
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("article_id");
              expect(article).not.toHaveProperty("body");
              expect(article).toHaveProperty("topic");
              expect(article.topic).toBe("mitch");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("article_img_url");
              expect(article).toHaveProperty("comment_count");
            });
          });
      });

      test("200: GET /api/articles?topic= [mitch, paper, cat] return all articles when ommited o not in the valid range", () => {
        return request(app)
          .get("/api/articles?topic=maria")
          .expect(200)
          .then((data) => {
            expect(Array.isArray(data.body.articles)).toBe(true);
            expect(data.body.articles.length).toBe(13);
            data.body.articles.forEach((article) => {
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("article_id");
              expect(article).not.toHaveProperty("body");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("article_img_url");
              expect(article).toHaveProperty("comment_count");
            });
          });
      });

      test("404: GET /api/articles?topic= valid but not existing value return msg error not found", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(404)
          .then((data) => {
            expect(data.body.msg).toBe("Not found");
          });
      });

      test("200: GET /api/articles/:article_id (comment_count) calculate how many comment has been made for a article with id provided", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((data) => {
            expect(data.body.article).toHaveProperty("author");
            expect(data.body.article).toHaveProperty("title");
            expect(data.body.article).toHaveProperty("article_id");
            expect(data.body.article.article_id).toBe(1);
            expect(data.body.article).toHaveProperty("body");
            expect(data.body.article).toHaveProperty("topic");
            expect(data.body.article).toHaveProperty("created_at");
            expect(data.body.article).toHaveProperty("votes");
            expect(data.body.article).toHaveProperty("article_img_url");
            expect(data.body.article).toHaveProperty("comment_count");
            expect(data.body.article.comment_count).toBe("11");
          });
      });

      test("404: GET /api/articles/:article_id (comment_count)  return msg error when id not existig but in the range", () => {
        return request(app)
          .get("/api/articles/111")
          .expect(404)
          .then((data) => {
            expect(data.body.msg).toBe("Not found");
          });
      });

      test("400: GET /api/articles/:article_id (comment_count)  return msg error when id not existig but in the range", () => {
        return request(app)
          .get("/api/articles/invalidValue")
          .expect(400)
          .then((data) => {
            expect(data.body.msg).toBe("Bad request");
          });
      });

    
    });
    describe("PATCH", () => {
      test("200: PATCH /api/articles/:article_id  update article by the id provided in params inc/decr votes value", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -3 })
          .expect(200)
          .then((data) => {
            const artToCompare = {
              article_id: 1,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              title: "Living in the shadow of a great man",
              topic: "mitch",
              votes: 97,
            };
            expect(data.body.article).toEqual(artToCompare);
          });
      });

      test("404: PATCH /api/articles/:article_id  return error msg when try to acces to a not existing id value but in its range", () => {
        return request(app)
          .patch("/api/articles/876")
          .send({ inc_votes: 100 })
          .expect(404)
          .then((data) => {
            expect(data.body.msg).toBe("Not found");
          });
      });

      test("400: PATCH /api/articles/:article_id  return error msg when try to acces to not valid id out of range", () => {
        return request(app)
          .patch("/api/articles/butterfly")
          .send({ inc_votes: 100 })
          .expect(400)
          .then((data) => {
            expect(data.body.msg).toBe("Bad request");
          });
      });

      test("400: PATCH /api/articles/:article_id update return error msg when try to acces to not valid id out of range", () => {
        return request(app)
          .patch("/api/articles/butterfly")
          .send({ inc_votes: 100 })
          .expect(400)
          .then((data) => {
            expect(data.body.msg).toBe("Bad request");
          });
      });
    });
  });

  describe("Test comments", () => {
    describe("GET", () => {
      test("200: GET api/articles/:article_id/comments => get all comments for an article of the id = article_id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then((data) => {

            expect(Array.isArray(data.body.comments)).toBe(true);
            expect(data.body.comments.length).toBe(11);
            expect(data.body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
            data.body.comments.forEach((comment) => {
              expect(comment).toHaveProperty("comment_id");
              expect(comment).toHaveProperty("votes");
              expect(comment).toHaveProperty("created_at");
              expect(comment).toHaveProperty("author");
              expect(comment).toHaveProperty("body");
              expect(comment).toHaveProperty("article_id");
            });
          });
      });

      test("404: GET api/articles/:article_id/comments => return a error msg when id pass does not exist but is on the range", () => {
        return request(app)
          .get("/api/articles/455/comments")
          .expect(404)
          .then((data) => {
            expect(data.body.msg).toBe("Not found");
          });
      });

      test("400: GET api/articles/:article_id/comments => return a error msg when id pass does not exist but is on the range", () => {
        return request(app)
          .get("/api/articles/tea/comments")
          .expect(400)
          .then((data) => {
            expect(data.body.msg).toBe("Bad request");
          });
      });

      test("200: GET api/comments => get all comments", () => {
        return request(app)
          .get("/api/comments")
          .expect(200)
          .then((data) => {
            expect(Array.isArray(data.body.comments)).toBe(true);
            expect(data.body.comments.length).toBe(18);
            data.body.comments.forEach((comment) => {
              expect(comment).toHaveProperty("comment_id");
              expect(comment).toHaveProperty("votes");
              expect(comment).toHaveProperty("created_at");
              expect(comment).toHaveProperty("author");
              expect(comment).toHaveProperty("body");
              expect(comment).toHaveProperty("article_id");
            });
          });
      });
    });
  });
    describe("POST/DELETE", () => {
      test("201: POST /api/articles/:article_id/comments insert new comment", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({
            username: "lurker",
            body: "this comment is about the food article ",
          })
          .expect(201)
          .then((response) => {
            const { body } = response;
            expect(body.comment).toHaveProperty("comment_id");
            expect(body.comment).toHaveProperty("votes");
            expect(body.comment).toHaveProperty("created_at");
            expect(body.comment).toHaveProperty("author");
            expect(body.comment).toHaveProperty("body");
            expect(body.comment).toHaveProperty("article_id");
            expect(body.comment.author).toBe("lurker");
            expect(body.comment.body).toBe(
              "this comment is about the food article "
            );
            expect(body.comment.article_id).toBe(2);
          });
      });

      test("400: POST /api/articles/:article_id/comments return msg with bad request, when we pass a not existing article_id", () => {
        return request(app)
          .post("/api/articles/244/comments")
          .send({
            username: "lurker",
            body: "this comment is about the food article ",
          })
          .expect(400)
          .then((response) => {
            const { body } = response;

            expect(body.msg).toBe("Bad request");
          });
      });

      test("400: POST /api/articles/:article_id/comments return msg with bad request, when we pass a not existing username", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "aaa",
            body: "this comment is about the food article ",
          })
          .expect(400)
          .then((response) => {
            const { body } = response;

            expect(body.msg).toBe("Bad request");
          });
      });

      test("204: DELETE /api/comments/:comment_id return code 204 delete succedd", () => {
        return request(app).delete("/api/comments/5").expect(204);
      });

      test("404: DELETE /api/comments/:comment_id return error msg when pass a comment_id no existing buy in the range", () => {
        return request(app)
          .delete("/api/comments/555")
          .expect(404)
          .then((response) => {
            const { body } = response;

            expect(body.msg).toBe("Not found");
          });
      });

      test("400: DELETE /api/comments/:comment_id return error msg when pass a value for comment_id out of range", () => {
        return request(app)
          .delete("/api/comments/maria")
          .expect(400)
          .then((response) => {
            const { body } = response;

            expect(body.msg).toBe("Bad request");
          });
      });
    });
  });

  describe("Test users", () => {
    test("200: GET api/users get all users", () => {
      return request(app)
        .get("/api/users")
        .send({description : "get all users"})
        .expect(200)
        .then((data) => {
          console.log(data.body)
          expect(Array.isArray(data.body.users)).toBe(true);
          expect(data.body.users.length).toBe(4);
          data.body.users.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
  });

