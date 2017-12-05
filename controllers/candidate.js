"use strict"

var fs          = require("fs");
var path        = require("path");
var Candidate   = require("../models/candidate");

function createCandidate(req, res){
    let name = req.body.name;
    let bio = req.body.bio;
    let image = (req.body.image)? req.body.image:"placeholder_350x150.png";

    let candidate = new Candidate({name, bio, image});

    candidate.save().then(
        response => {
            return res.status(200).send({
                msg: "Candidate saved", 
                success: true, 
                data: {
                    candidate: response
                }
            });
        }
    ).error(
        error => {
            return res.status(500).send({
                msg: "There was an error while saving your candidate", 
                success: false, 
                data: {
                    error: error
                }
            });
        }
    );
}

function listCandidates(req, res){
    Candidate.run().then(
        response => {
            return res.status(200).send({
                msg: "Candidates retreived", 
                success: true, 
                data: {
                    candidates: response
                }
            });
        }
    ).error(
        error => {
            return res.status(500).send({
                msg: "There was an error while retriving the candidates", 
                success: false, 
                data: {
                    error: error
                }
            });
        }
    );
}

function getCandidate(req, res){
    let id = req.params.id;

    Candidate.get(id).run().then(
        response => {
            return res.status(200).send({
                msg: "Candidate retreived", 
                success: true, 
                data: {
                    candidate: response
                }
            });
        }
    ).error(
        error => {
            return res.status(500).send({
                msg: "There was an error while retriving the candidate", 
                success: false, 
                data: {
                    error: error
                }
            });
        }
    );
}

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
    var path_file = "./uploads/images/candidate/" + imageFile;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: "Image doesn't exists" });
        }
    });
}


module.exports = {
    createCandidate,
    listCandidates,
    getCandidate,
    uploadImage,
    getImage
}


