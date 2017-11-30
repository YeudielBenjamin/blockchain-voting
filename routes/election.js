"use strict"
var express = require("express");

var md_auth = require("../middlewares/auth");
var md_root = require("../middlewares/root");

var ElectionController = require("../controllers/election");

var api = express.Router();

api.post("/election", [md_auth.ensureAuth, md_root.isRoot], ElectionController.createElection);
api.get("/election", md_auth.ensureAuth, ElectionController.listElections );

module.exports = api;