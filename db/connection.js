var mongoose    = require("mongoose");
//connect to MongoDB
mongoose.connect("mongodb://localhost/snapmap")
//allows mongoose to have promises
mongoose.Promise = global.Promise

//exports mongoose
module.exports = mongoose
