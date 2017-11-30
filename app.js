"use strict"
const express =     require('express');
const bodyParser =  require("body-parser");

const app = express();
const PORT = 3000;

var user_routes         = require("./routes/user");
var transaction_routes  = require("./routes/transaction");
var election_routes     = require("./routes/election");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

  next();
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.use("/api", user_routes);
app.use("/api", transaction_routes);
app.use("/api", election_routes);

app.listen(PORT, function () {
  console.log(`App listening on port ${PORT}!`);
});

