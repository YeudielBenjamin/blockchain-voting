"use strict"

exports.isRoot = function(req, res, next){
    if (req.user.username !== "Root"){
        return res.status(401).send({
            msg: "Unauthorized user", 
            success: false, 
            data: {}
        });
    }

    next();
}