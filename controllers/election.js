"use strict"

var Election = require("../models/election");

function createElection(req, res){
    let title = req.body.title;
    let description = req.body.description;
    let options = req.body.options;

    let election = new Election({
        title,
        description, 
        options
    });

    election.save().then(
        response => {
            return res.status(200).send({
                msg: "Election saved", 
                success: true, 
                data: {
                    election: response
                }
            });
        }
    ).error(
        error => {
            return res.status(500).send({
                msg: "There was an error while saving your election", 
                success: false, 
                data: {
                    error: error
                }
            });
        }
    );
}

function listElections(req, res){
    Election.run().then(
        response => {
            return res.status(200).send({
                msg: "Elections retreived", 
                success: true, 
                data: {
                    elections: response
                }
            });
        }
    ).error(
        error => {
            return res.status(500).send({
                msg: "There was an error while retriving the elections", 
                success: false, 
                data: {
                    error: error
                }
            });
        }
    );
}

module.exports = {
    createElection,
    listElections
}