"use strict"
var bcrypt      = require("bcrypt-nodejs");
var bigchain    = require('bigchaindb-driver');
var jwt         = require("../services/jwt");
var User        = require("../models/user");
var thinky      = require("../util/thinky");
var globalVar   = require("../global");
var Errors  = thinky.Errors;

function createUser(req, res){
    let curp = req.body.curp;
    let user = new User({
        nombre: req.body.nombre,
        clave_elector: req.body.clave_elector,
        curp: curp,
        fecha_nacimiento: req.body.fecha_nacimiento,
        estado: req.body.estado,
        municipio: req.body.municipio,
        seccion: req.body.seccion,
        localidad: req.body.localidad,
        emision: req.body.emision,
        vigencia: req.body.vigencia,
        ine: req.body.ine
    });
    User.getAll(curp, {index: "curp"}).unique().run().then(
        response => {
            return res.status(400).send({
                msg: "User already registered",
                data: {}
            })
        },
        error => {
            user.validate().then(
                response => {
                    user.save().then(
                        response => {
                            return res.status(200).send({
                                msg: "User created",
                                data: {
                                    user: user.clear()
                                }
                            })
                        }
                    ).error(
                        error => {
                            return res.status(500).send({
                                msg: "Couldn't save user",
                                data: {
                                    error: error.message
                                }
                            })
                        }
                    );
                },
                error => {
                    return res.status(400).send({
                        msg: "Missing parameters",
                        data: {
                            error: error.message
                        }
                    });
                }
            );
        }
    );
}

function readUser(req, res){
    let id = req.user.id;
    User.get(id).getView().run().then(
        user => {
            return res.status(200).send({
                msg: "User retreived",
                data: {
                    user
                }
            });
        }
    ).error( 
        error => {
            return res.status(404).send({
                msg: "User not found",
                data: {
                    error: error.message
                }
            });
        }
    );
}

function login(req, res){
    let curp = req.body.username;
    let password = req.body.password;

    if(curp === "root" && password === "root"){
        
        return res.status(200).send({
            msg: "Logged in",
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
        User.getAll(curp, {index: "curp"}).unique().run().then(
            user => {
                console.log(user);
                bcrypt.compare(password, user.password, (err, check) => {
                    if (err){
                        return res.status(500).send({
                            msg: "There was an error while processing your request, please try again later", 
                            data: {}
                        });
                    }
                    else {
                        console.log("CHECK");
                        console.log(check);
                        if (check){
                            console.log(user.firstLogin);
                            if (user.firstLogin){
                                return res.status(200).send({
                                    msg: "Please change your password",
                                    data: {
                                        token: jwt.updateToken({id: user.id}),
                                        change_pass: true
                                    }
                                });
                            } else {
                                return res.status(200).send({
                                    msg: "Logged in",
                                    data: {
                                        token: jwt.createToken({
                                            id: user.id,
                                            username: user.nombre
                                        }),
                                        user: user.clear()
                                    }
                                });
                            }
                        } else {
                            return res.status(403).send({
                                msg: "Invalid credentials",
                                data: {}
                            });
                        }
                    }
                });
            }
        ).catch(Errors.DocumentNotFound, error => {
            return res.status(403).send({
                msg: "Invalid credentials",
                data: {
                    error: error.message
                }
            });
        }).error(
            error => {
                res.status(500).send({
                    msg: "Error while retreiving your user",
                    data: {
                        error: error.message
                    }
                });
            }
        );
    }    
}

function getKeys(req, res){
    let id = req.user.id;
    User.get(id).run().then(
        user => {
            if (!user.keyPairsGenerated){
                let keys = new bigchain.Ed25519Keypair();
                user.publicKey = keys.publicKey;
                user.keyPairsGenerated = true;
                user.save().then(
                    response => {
                        // Whitelist Public key as root
                        let rootPublic = "912n69Zq8S8erwn7kw7kTkEicev991RU7tbN7M4daqqs";
                        let rootPrivate = "bQiKxcjGz7CDLX6giK7eeM6ZHDm8Dn7b59JhibByKFV";

                        const tx = bigchain.Transaction.makeCreateTransaction(
                            { type: "Whitelist", address: user.publicKey + "+W" },
                            { addedBy: "Root" },
                            [ bigchain.Transaction.makeOutput(
                                bigchain.Transaction.makeEd25519Condition(rootPublic))
                            ],
                            rootPublic
                        );

                        const signedTx = bigchain.Transaction.signTransaction(tx, rootPrivate);
                        const conn = new bigchain.Connection(globalVar.API_PATH);
                        conn.postTransaction(signedTx)
                            .then(
                                response => {
                                    return conn.pollStatusAndFetchTransaction(signedTx.id);
                                },
                                error => {
                                    return res.status(500).send({msg: "Error while saving your transaction to the blockchain", data: {error}});
                                }
                            ).then(
                                response => {
                                    return res.status(200).send({
                                        msg: "User updated",
                                        data: {
                                            user: user.clear(),
                                            keys: keys,
                                            blockchainInfo: response
                                        }
                                    });
                                },
                                error => {
                                    return res.status(500).send({msg: "Error while retreiving your transaction", data: {error}});
                                }
                            );
                    },
                    error => {
                        return res.status(500).send({
                            msg: "There was an error",
                            data: error.message
                        });
                    }
                );
            }
            else {
                return res.status(200).send({
                    msg: "Keys already issued",
                    data: {}
                });
            }
        },
        error => {
            return res.status(500).send({
                msg: "There was an error while processing your request",
                data: {
                    error: error.message
                }
            })
        }
    );
}

function updatePassword(req, res){
    console.log("changin pass :v");
    let id = req.user.id;
    let password = req.body.password;
    User.get(id).run().then(
        user => {
            bcrypt.hash(password, null, null, (err, hash) => {
                if(err){
                    res.status(500).send({
                        msg: "There was a problem while updating your information", 
                        success: false, 
                        data: {}
                    });
                }
                else{
                    user.password = hash;
                    user.firstLogin = false;
                    console.log("Saving this");
                    console.log(user);
                    User.get(id).update(user).run().then(
                        response => {
                            console.log(response);
                            delete response.password;
                            delete response.firstLogin;
                            delete response.keyPairsGenerated;
                            
                            return res.status(200).send({
                                msg: "Password updated",
                                data: {
                                    user: response
                                }
                            });
                        }
                    ).error(
                        error => {
                            return res.status(500).send({
                                msg: "There was an error while updating your information", 
                                success: false, 
                                data: {
                                    error: error
                                }
                            });
                        }
                    );
                }
            });
        }
    ).catch(Errors.DocumentNotFound, error => {
        return res.status(403).send({
            msg: "Invalid credentials", 
            success: false, 
            data: {
                error: error
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
}

module.exports = {
    createUser,
    readUser,
    login,
    updatePassword,
    getKeys
};