var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");

var exphbs = require("express-handlebars");

var PORT = process.env.PORT || 3000;
// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




// Routes
var routes = require("./controllers/routeController.js");

app.use("/", routes);
// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
