"use strict"
var thinky = require("../util/thinky");
var type = thinky.type;

var User = thinky.createModel("User", {
    id: type.string(),
    username: type.string(),
    password: type.string()
});

module.exports = User;