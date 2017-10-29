"use strict"
const express = require('express');
const bigchain = require('bigchaindb-driver');

const app = express();
const port = 3000;
const API_PATH = 'http://localhost:9984/api/v1/'

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
});

