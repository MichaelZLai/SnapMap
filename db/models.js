var mongoose    = require("./connection");
var crypto      = require("crypto");
var jwt         = require("jsonwebtoken");

//defines marker schema for image
var MarkerSchema = new mongoose.Schema({
  imageurl: String,
  long: Number,
  lat: Number,
  desc: String,
})

//defines User schema for multiple markers
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    },
    name: {
      type: String,
      required: true,
      },
      hash: String,
      salt: String,
    },
  markers: [MarkerSchema],
})

//instead of saving the password, passing it through the setpassword function to salt and hash
UserSchema.methods.setPassword = (password) =>{
  this.salt = crypto.randomBytes(16).toString("hex")
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString("hex")
}
//checking the password
UserSchema.methods.validPassword = (password) =>{
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString("hex")
  return this.hash === hash
}

//exports the schema models
module.exports = {
  User: mongoose.model("User", UserSchema),
  Marker: mongoose.model("Marker", MarkerSchema),
}
