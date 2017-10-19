
var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");

var results = [];
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
    var counter = 0;
    $("h2.story-heading").each(function (i, element) {

      var link = $(element).children().attr("href");
      var title = $(element).children().text();
      title.replace("\n", "");
      // Save these results in an object that we'll push into the results array we defined earlier
      if (title && link) {
        results.push({
          counter: counter,
          title: title,
          link: link
        });
        counter++;
        /*      db.scrapedData.insert({
                title: title,
                link: link
              });*/
      }
    });


    // Log the results once you've looped through each of the elements found with cheerio
    //console.log(results);
    res.send(results);
  });


});

app.post("/save/:id", function (req, res) {
  console.log(req.params.id);
});

// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});
