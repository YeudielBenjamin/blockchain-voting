"use strict"
var thinky      = require("../util/thinky");
var type = thinky.type;

var Election = thinky.createModel("Election", {
    id: type.string(),
    title: type.string(),
    description: type.string(),
    options: [type.string()],
    image: type.string()
});

module.exports = Election;

var Candidate = require("./candidate");
Election.hasAndBelongsToMany(Candidate, "candidates", "id", "id");