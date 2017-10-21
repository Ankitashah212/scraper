var express = require("express");


var router = express.Router();

// Import the model (snack.js) to use its database functions.
// Require all models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

