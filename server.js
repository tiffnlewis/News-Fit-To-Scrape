var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var mongoose = require("mongoose");
mongoose.plugin(require("mongoose-create-unique"))
var cheerio = require("cheerio");
//var db = require("./models")
var exphbs = require("express-handlebars");
var PORT = process.env.PORT || 4000
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
var routes = require('./routes.js')(app)


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise
mongoose.connect(MONGODB_URI)

app.listen(PORT, function() {
    console.log("App running on port " + PORT);
  });