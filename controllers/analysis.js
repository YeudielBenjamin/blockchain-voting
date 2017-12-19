"use strict"
var http        = require('http')
var timeseries  = require("timeseries-analysis");

function getData(req, res){
    http.get({
        hostname: 'localhost',
        port: 80,
        path: '/',
        agent: false  // create a new agent just for this one request
      }, 
      response => {
        // Do stuff
      })
}

module.exports = {
};