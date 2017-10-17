/* Students: Using the tools and techniques you learned so far,
 * you will scrape a website of your choice, then place the data
 * in a MongoDB database. Be sure to make the database and collection
 * before running this exercise.

 * Consult the assignment files from earlier in class
 * if you need a refresher on Cheerio. */

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();
app.use(express.static("public"));
// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function (req, res) {
  res.send("Hello world");
});

/* TODO: make two more routes
 * -/-/-/-/-/-/-/-/-/-/-/-/- */
app.get("/scrape", function (req, res) {

  request("http://www.nytimes.com", function (error, response, html) {

    var $ = cheerio.load(html);
    // An empty array to save the data that we'll scrape
    var results = [];

    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    $("h2.story-heading").each(function (i, element) {

      var link = $(element).children().attr("href");
      var title = $(element).children().text();

      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        title: title,
        link: link
      });
      db.scrapedData.insert({
        title: title,
        link: link
      });
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
    res.send(results);
  });


});

app.get("/all", function (req, res) {

});

// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});
