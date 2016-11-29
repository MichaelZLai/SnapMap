var passport      = require("passport");
var LocalStrategy = require("passport-local");
var mongoose      = require("../db/connection");
var models        = require("../db/models");

var User          = mongoose.model("User");


passport.use(new LocalStrategy({
  usernameField: "email"
},
(username, password, done) =>{
  User.findOne({email: username}, (err, user) =>{
    if (err) {
      return done(err)
    }
    //Return if user is not found in db
    if (!user){
      return done(null, false, {
        message: "User Not Found"
      })
    }
    //Return if password is wrong
    if (!user.validPassword(password)){
      return done(null, false, {
        message: "Password is Wrong"
      })
    }
    //Return user object, if credentials are correct
    return done(null, user)
  })
}))
