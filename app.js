"use strict" ;



var http = require("http");
var users = require("./routes/users.js");
var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var cors = require("cors");
//all environments

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.set("port", process.env.PORT || 4003);



app.post("/convert_url", users.convertUrl);
app.post("/redirect_url", users.redirectUrl) ;


var httpServer = http.createServer(app).listen(app.get("port"), function() {
  console.log("Express server listening on port " + app.get("port"));
});

module.exports = app;