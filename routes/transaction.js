"use strict"
var express = require("express");

var md_auth = require("../middlewares/auth");
var TransactionController = require("../controllers/transaction");

var api = express.Router();

api.post("/transaction", md_auth.ensureAuth, TransactionController.newTransaction);
api.post("/keypair", md_auth.ensureAuth, TransactionController.createPair);

module.exports = api;