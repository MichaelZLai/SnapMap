var mongoose    = require("./connection");

//defines marker schema for image
var MarkerSchema = new mongoose.Schema({
  imageurl: String,
  long: Number,
  lat: Number,
  desc: String,
})

//defines Trip schema for the specific marker
var TripSchema = new mongoose.Schema({
  tripname: String,
  markers: [MarkerSchema],
})

//exports the schema models
module.exports = {
  Trip: mongoose.model("Trip", TripSchema),
  Marker: mongoose.model("Marker", MarkerSchema),
}
