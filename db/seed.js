var mongoose      = require("./connection");
var seedData      = require("./seeds");
var models        = require("./models");
var Marker        = mongoose.model("Marker");

Marker.remove({}).then( _ => {
  Marker.collection.insert(seedData)
  .then( _ => process.exit())
}).catch( err => console.log(err))
