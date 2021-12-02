# Back End Project

## Link to hosted version

This endpoints of this project can be explored at https://jc-news-app.herokuapp.com/api
The front end app built to use the endpoints of this project can be found here: https://jc-news.netlify.app

## Summary

The aim of this project was to produce a news api that:

  - Created tables and seeded a database
  - Created a variety endpoints

This project is utilised by my front end news application, the code for which can be found here: https://github.com/J-Coke/nc-news

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
