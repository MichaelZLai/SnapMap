var mongoose      = require("./connection");
var seedData      = require("./seeds");
var models        = require("./models");
var User          = mongoose.model("User");
var Marker        = mongoose.model("Marker");

User.remove({}).then( _ => {
  User.collection.insert(seedData)
  .then( _ => process.exit())
}).catch( err => console.log(err))
