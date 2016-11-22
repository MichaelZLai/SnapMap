var mongoose      = require("./connection");
var seedData      = require("./seeds");
var models        = require("./models");
var Trip          = mongoose.model("Trip");
var Marker        = mongoose.model("Marker");

Trip.remove({}).then( _ => {
  Trip.collection.insert(seedData)
  .then( _ => process.exit())
}).catch( err => console.log(err))
