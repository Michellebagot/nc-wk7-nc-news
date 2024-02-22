# Northcoders News API

## SUMMARY

Northcoders News is a mock project as fulfilment of the Northcoders Software Development Bootcamp - Back End Section. The project has been to create a "reddit" style social network which allows for forum style interaction and contains the back-end coding.

A hosted version of this project can be found at : https://nc-wk7-nc-news.onrender.com/api

## DEVELOPER INFORMATION

### How to clone

To clone this repository, within your terminal, navigate to an appropriate directory and use the command

```
git clone https://github.com/Michellebagot/nc-wk7-nc-news
```

### How to install dependencies

The following dependences are required for this project

Developer Dependencies

- jest - "^27.5.1"
- jest-extended - "^2.0.0"
- jest-sorted - "^1.0.14"
- pg-format - "^1.0.4"
- supertest - "^6.3.4"

Dependencies

- husky - "^8.0.2"
- dotenv - "^16.0.0"
- express - "^4.18.2"
- pg - "^8.11.3"

To install dependences, use
```
npm install <dependency name>
```
though please ensure documentation is followed in the first instance!

### How to seed local databases

Databases are initially setup using the following command:

```
npm run setup-dbs
```

Afterwhich, the following command will seed the database:

``` 
npm run seed
```

### How to run tests

Tests are run using Jest and the following command:

```
npm test
```

### Local environment variables

In order to run this repository locally, you will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names).

### Minimum requirements

This project was created using:

- Node.js version 21.5.0
- Postgres version 14.10

Using earlier versions may cause performance issues.
