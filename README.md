# Northcoders News API
API for the purpose of accessing application data programmatically. To mimic the building of a real world backend service which should provide this information to the front end architecture.


## Sumary News API

#### GET /api/topics
    responds with a list of topics

#### GET /api
    responds with a list of available endpoints

#### GET /api/articles/:article_id
    responds with a single article by article_id

#### GET /api/articles
    responds with a list of articles

#### GET /api/articles/:article_id/comments
    responds with a list of comments by article_id

#### POST /api/articles/:article_id/comments
    add a comment by article_id

#### PATCH /api/articles/:article_id
    updates an article by article_id

#### DELETE /api/comments/:comment_id
    deletes a comment by comment_id

#### GET /api/users
    responds with a list of users

#### GET /api/articles (queries)
    allows articles to be filtered and sorted

#### GET /api/articles/:article_id (comment count)
    adds a comment count to the response when retrieving a single article


## Version required
    Node.js v22.4.0
    PostgreSQL v16.4 


## Clone
    git clone https://github.com/CarmenChapi/NewsCarmen


## Install dependencies
    npm i -D jest 
    npm install supertest
    npm install dotenv
    npm install husky
    npm install pg
    npm install express
    npm install nodemon
    npm i -D jest-sorted
    npm pg-format


## Seed local database 
    node ./db/seeds/run-seed.js

## Run tests 
    npm test utils
    npm test severs

## For set up the database you need:
    Create in the project dirv22.4.0ectory path 2 files called '.env.development' and '.env.test' and each must contain:

### PGDATABASE=name_databe_dev  
    in .env.development

### PGDATABASE=name_databe_test 
    in .env.test

## Link to the hosted version
    https://newscarmen.onrender.com/api







This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

https://github.com/northcoders/be-nc-news


