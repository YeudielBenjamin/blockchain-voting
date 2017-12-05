"use strict"
var thinky = require("../util/thinky");
var type = thinky.type;

var Candidate = thinky.createModel("Candidate", {
    id: type.string(),
    name: type.string(),
    bio: type.string(),
    image: type.string()
});

module.exports = Candidate;

var Election = require("./election");
Candidate.hasAndBelongsToMany(Election, "elections", "id", "id");