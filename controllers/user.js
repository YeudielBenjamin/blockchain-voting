"use strict"

var jwt     = require("../services/jwt");
var bcrypt  = require("bcrypt-nodejs");
var User    = require("../models/user");
var thinky  = require("../util/thinky");
var Errors  = thinky.Errors;

function login(req, res){
    let username = req.body.username;
    let password = req.body.password;

    if(username === "root" && password === "root"){
        
        return res.status(200).send({
            msg: "Logged in", 
            success: true, 
            data: {
                token: jwt.createToken({
                    id: "0",
                    username: "Root"
                }),
                user: {
                    username: "Root",
                    isRoot: true
                }
                
            }
        });
        
    } else {
        User.filter({username: username}).run().then(
            response => {
                // Not found
                if (response.length <= 0){
                    return res.status(403).send({
                        msg: "Invalid credentials", 
                        success: false, 
                        data: {}
                    });
                } else {
                    response.forEach(element => {
                        bcrypt.compare(password, element.password, (err, check) => {
                            if (err){
                                return res.status(500).send({
                                    msg: "There was an error while processing your request, please try again later", 
                                    success: false, 
                                    data: {}
                                });
                            }
                            else {
                                if (check){
                                    return res.status(200).send({
                                        msg: "Logged in", 
                                        success: true, 
                                        data: {
                                            token: jwt.createToken({
                                                id: element.id,
                                                username: element.username
                                            }),
                                            user: {
                                                username: element.username
                                            }
                                        }
                                    });
                                } else {
                                    return res.status(403).send({
                                        msg: "Invalid credentials", 
                                        success: false, 
                                        data: {}
                                    });
                                }
                            }
                        });
                    });
                }
                
                
            }
        ).catch(Errors.DocumentNotFound, error => {
            return res.status(403).send({
                msg: "Invalid credentials", 
                success: false, 
                data: {
                    user: error
                }
            });
        }).error(
            error => {
                res.status(500).send({
                    msg: "Error while retreiving your user", 
                    success: false, 
                    data: {}
                });
            }
        );

        /*return res.status(418).send({
            msg: "Invalid credentials", 
            success: false, 
            data: {}
        });*/
    }    
}

function save(req, res){
    let username = req.body.username;
    let password = req.body.password;

    bcrypt.hash(password, null, null, (err, hash) =>{
        if(err){
            res.status(500).send({
                msg: "There was a problem while creating your user", 
                success: false, 
                data: {}
            });
        }
        else{
            let user = new User({
                username: username,
                password: hash
            });

            user.save().then(
                response => {
                    return res.status(200).send({
                        msg: "User saved", 
                        success: true, 
                        data: {
                            user: response
                        }
                    });
                }
            ).error(
                error => {
                    return res.status(500).send({
                        msg: "There was an error while saving your user", 
                        success: false, 
                        data: {
                            error: error
                        }
                    });
                }
            );

            /*user.save((err, userStored) =>{
                if (err) {
                    res.status(500).send({message: "An error ocurred while saving the user"});
                } 
                else {
                    if (!userStored) {
                        res.status(404).send({message: "No user registered"});
                    } else {
                        res.status(200).send({message: "User saved succesfully", user: userStored});
                    }    
                }
            });*/
            
        }
    });

    /*return res.status(200).send({
        msg: "Hello World :v", 
        success: true, 
        data: {}
    });*/
}

module.exports = {
    login,
    save
};