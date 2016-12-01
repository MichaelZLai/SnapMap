var mongoose    = require("./connection");
var crypto      = require("crypto");
var jwt         = require("jsonwebtoken");

//defines marker schema for image
var MarkerSchema = new mongoose.Schema({
  imageurl: String,
  lng: Number,
  lat: Number,
  desc: String,
  user: String,
})


//exports the schema models
module.exports = {
  Marker: mongoose.model("Marker", MarkerSchema),
}
