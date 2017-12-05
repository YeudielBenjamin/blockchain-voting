"use strict"
var express     = require("express");
var multipart   = require("connect-multiparty");

var md_auth     = require("../middlewares/auth");
var md_root     = require("../middlewares/root");
var md_upload   = multipart({uploadDir: "./uploads/images/candidate"});

var CandidateController = require("../controllers/candidate");

var api = express.Router();

api.post("/candidate", [md_auth.ensureAuth, md_root.isRoot], CandidateController.createCandidate);
api.get("/candidate", md_auth.ensureAuth, CandidateController.listCandidates );
api.get("/candidate/:id", md_auth.ensureAuth, CandidateController.getCandidate );
api.post("/candidate-image", [md_auth.ensureAuth, md_root.isRoot, md_upload], CandidateController.uploadImage);
api.get("/candidate-image/:name", CandidateController.getImage );

module.exports = api;