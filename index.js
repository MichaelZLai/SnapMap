var express       = require("express");
var app           = express();
var mongoose      = require("./db/connection");
var models        = require("./db/models");
var bodyParser    = require("body-parser");
var Trip          = mongoose.model("Trip");
var Marker        = mongoose.model("Marker");


//utilize files in the public folder
app.use(express.static("public"));

//set view engine to be hbs
app.set("view engine", "hbs")

//set up port and listen to local host
app.set("port", process.env.PORT || 5000)
app.listen(app.get("port"), _ => {
  console.log("Consequences....")
})

//use body-parser for handlebars and generating api responses
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json({extended:true}))

//renders the front end layout
app.get("/", (req,res) =>{
  res.render("layout", {})
})
