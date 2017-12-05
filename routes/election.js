"use strict"
var express     = require("express");
var multipart   = require("connect-multiparty");

var md_auth     = require("../middlewares/auth");
var md_root     = require("../middlewares/root");
var md_upload   = multipart({uploadDir: "./uploads/images/election"});

var ElectionController = require("../controllers/election");

var api = express.Router();

api.post("/election", [md_auth.ensureAuth, md_root.isRoot], ElectionController.createElection);
api.get("/election", md_auth.ensureAuth, ElectionController.listElections );
api.get("/election/:id", md_auth.ensureAuth, ElectionController.getElection );
api.post("/election-image", [md_auth.ensureAuth, md_root.isRoot, md_upload], ElectionController.uploadImage);
api.get("/election-image/:name", ElectionController.getImage );

module.exports = api;