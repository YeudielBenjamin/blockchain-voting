"use strict"

var fs          = require("fs");
var path        = require("path");
var Election    = require("../models/election");

function uploadImage(req, res){
    if (req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split("/");
        var file_name = file_split[file_split.length - 1];
        var ext_split = file_name.split("\.");
        var file_ext = ext_split[ext_split.length -1].toLowerCase();
        if (file_ext=="png" || file_ext=="jpg" || file_ext=="jpeg"){
            return res.status(200).send({
                msg: "Image uploaded", 
                success: true, 
                data: {
                    filename: file_name
                }
            });
        }
        else {
            return res.status(400).send({
                msg: "Invalid file format", 
                success: false,
                data: {}
            });
        }
    } 
}

function getImage(req, res){
    var imageFile = req.params.name;
    var path_file = "./uploads/images/election/" + imageFile;
    console.log(path_file);

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: "Image doesn't exists" });
        }
    });
}

function createElection(req, res){
    let title = req.body.title;
    let description = req.body.description;
    let options = req.body.options;
    let candidates = req.body.candidates;
    var image = (req.body.image)? req.body.image:"placeholder_350x150.png";

    let election = new Election({
        title,
        description, 
        options,
        image
    });

    election.candidates = candidates;

    election.saveAll({candidates: true}).then(
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

function getElection(req, res){
    let id = req.params.id;

    Election.get(id).getJoin({candidates: true}).then(
        response => {
            return res.status(200).send({
                msg: "Election retreived", 
                success: true, 
                data: {
                    election: response
                }
            });
        }
    ).error(
        error => {
            return res.status(500).send({
                msg: "There was an error while retriving the election", 
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
    uploadImage,
    listElections,
    getElection,
    getImage
}