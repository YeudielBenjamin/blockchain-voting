"use strict"
var jwt     = require("jwt-simple");
var moment  = require("moment");

var secret_key = "aMenuhvImsiGutkGBs3wXYUq89kMn94y";

exports.ensureAuth = function(req, res, next){
    if (!req.headers.authorization){
        return res.status(403).send({ 
            msg: "No authentication header found", 
            success: false, 
            data: {}
        });
    }
    var token = req.headers.authorization.replace(/['"]+/g, "");

    try {
        var payload = jwt.decode(token, secret_key);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({ 
                msg: "Token has expired", 
                success: false, 
                data: {}
            });
        }
    } catch (exception) {
        return res.status(404).send({ 
            msg: "Invalid token", 
            success: false, 
            data: {}
        });
    }
    req.user = payload;

next();
}