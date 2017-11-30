"use strict"

var jwt     = require("jwt-simple");
var moment  = require("moment");

var secret = "aMenuhvImsiGutkGBs3wXYUq89kMn94y";

exports.createToken = function(user){
    var payload = {
        sub: user.id,
        username: user.username,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    };

    return jwt.encode(payload, secret);
};