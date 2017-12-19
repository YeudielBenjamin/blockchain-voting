"use strict"
var express = require("express");

var md_auth = require("../middlewares/auth");
var md_root = require("../middlewares/root");
var UserController = require("../controllers/user");

var api = express.Router();

api.post("/login", UserController.login);
api.put("/update-password", md_auth.ensureAuth, UserController.updatePassword);
api.post("/create", [md_auth.ensureAuth, md_root.isRoot], UserController.createUser);
api.get("/keys", md_auth.ensureAuth, UserController.getKeys);

module.exports = api;