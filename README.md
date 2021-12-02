# NC News - Front End Project

## Link to hosted version

This project is hosted at https://jc-news-app.herokuapp.com/api

## Summary

The aim of this project was to produce a news api that:

  - Created tables and seeded a database
  - Created a variety endpoints

This application utilises my backend api project which is hosted here: https://jc-news-app.herokuapp.com/api and for which the code can be found here: https://github.com/J-Coke/Back-End-Project

## Setup

To host this locally you must have at minimum Node.js version v17.0.0 and Postgres v12.8.

Use the following command once in your desired directory to clone the repo:

`git clone https://github.com/J-Coke/Back-End-Project`

Change into the nc-news directory:

`cd nc-news`

Install npm:

`npm install -D`

Create .ENV files:

`touch .env.development`
`touch .env.test`

Set test and development databases:

`echo PGDATABASE=nc_news_test >> .env.test`
`echo PGDATABASE=nc_news >> .env.development`

Create databases:

`npm run setup-dbs`

Seed database:

`npm run seed`

Run tests:

`npm test`
