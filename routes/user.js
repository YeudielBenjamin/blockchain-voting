"use strict"
var express = require("express");

var md_auth = require("../middlewares/auth");
var md_root = require("../middlewares/root");
var UserController = require("../controllers/user");

var api = express.Router();

api.post("/login", UserController.login);
api.post("/register", [md_auth.ensureAuth, md_root.isRoot], UserController.save);

module.exports = api;