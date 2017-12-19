"use strict"

var jwt     = require("jwt-simple");
var moment  = require("moment");

var secret = "aMenuhvImsiGutkGBs3wXYUq89kMn94y";

/**
 * Creates a token for accesing protected resources
 * @param {id, userneme} user User retreived from the db
 */
function createToken(user){
    var payload = {
        sub: user.id,
        username: user.username,
        type: "session",
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    };

    return jwt.encode(payload, secret);
}

/**
 * Creates a temporary token to update a user
 * @param {id} user ID of the user
 */
function updateToken(user) {
    var payload = {
        id: user.id,
        type: "update",
        iat: moment().unix(),
        exp: moment().add(10, "minutes").unix()
    };

    return jwt.encode(payload, secret);
}

module.exports = {
    createToken,
    updateToken
}