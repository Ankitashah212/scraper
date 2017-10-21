var express = require("express");


var router = express.Router();

// An empty array to save the data that we'll scrape  
var results = [];
var request = require("request");


var mongoose = require("mongoose");
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scraper", {
  useMongoClient: true
});

// Our scraping tools
// It works on the client and on the server
var cheerio = require("cheerio");

// Import the model to use its database functions.
// Require all models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
router.get("/", function (req, res) {
    res.render("entry", {
      results: results,
      flag: false
    });
  });
  
  router.get("/scrape", function (req, res) {
  
  
  
    // Make a request call to grab the HTML body from the site of your choice
    request("https://www.huffingtonpost.com/", function (error, response, html) {
  
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(html);
  
  
  
      // Select each element in the HTML body from which you want information.
      // NOTE: Cheerio selectors function similarly to jQuery's selectors,
      // but be sure to visit the package's npm page to see how it works
      $("h2.card__headline").each(function (i, element) {
  
        var link = "https://www.huffingtonpost.com" + $(element).children().attr("href");
        var title = $(element).children().text();
  
        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
          count: i,
          title: title,
          link: link
        });
      });
  
      // Log the results once you've looped through each of the elements found with cheerio
      res.render("index", {
        results: results,
        flag: false
      });
    });
  
  });
  
  router.post("/save/:id", function (req, res) {
    // Save the article
    var id = req.params.id;
    console.log(id);
    var saveObj;
  
    for (var i = 0; i < results.length; i++) {
  
      if (results[i].count == id) {
        saveObj = results[i];
        results.splice(i, 1);
      }
    }
  
  
    Article
      .create(saveObj)
      .then(function (dbArticle) {
        // If we were able to successfully scrape and save an Article, send a message to the client
        res.render("index", {
          results: results,
          flag: true
        });
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  // Route for getting all Articles from the db
  router.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    Article
      .find({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.render("saved", {
          results: dbArticle
  
        });
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  router.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article
      .findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function (dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  router.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note
      .create(req.body)
      .then(function (dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
module.exports = router;