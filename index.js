var express       = require("express");
var path          = require("path");
var logger        = require("morgan");
var cookieParser  = require("cookie-parser");
var app           = express();
var mongoose      = require("./db/connection");
var models        = require("./db/models");
var bodyParser    = require("body-parser");
var User          = mongoose.model("User");
var Marker        = mongoose.model("Marker");
var router        = express.Router();
var jwt           = require("express-jwt");
var passport      = require("passport");
var LocalStrategy = require("passport-local");
var auth          = jwt({
                      secret: "chapultepec",
                      userProperty: "payload"
                    });

//use body-parser for handlebars and generating api responses
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json({extended:true}))

//initialize passport before using route middleware
app.use(passport.initialize());
app.use(passport.session());

//passport functionality
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

//register controller
app.post("/register",(req, res) =>{
  var user = new User()

  user.name = req.body.name
  user.email = req.body.email

  user.setPassword(req.body.password)

  user.save( err =>{
    var token;
    token = user.generateJwt()
    res.status(200)
    res.json({
      "token": token
    })
  })
})
//login controller
app.post("/login",(req, res) =>{
  passport.authenticate("local", (err, user, info) =>{
    var token;

    //If Passport throws/catches an error
    if (err) {
      res.status(404).json(err)
      return;
    }

    //if user is found
    if (user) {
      token = user.generateJwt()
      res.status(200)
      res.json({
        "token": token
      })
    } else {
      //if user is not found
      res.status(401).json(info)
    }
  }) (req,res)
})

//utilize files in the public folder
app.use(express.static("public"));

//set view engine to be hbs
app.set("view engine", "hbs")

//set up port and listen to local host
app.set("port", process.env.PORT || 5000)
app.listen(app.get("port"), _ => {
  console.log("Consequences....")
})

//catch unauthorize jwt user
app.use( (err, req, res, next) =>{
  if (err.name === "UnauthorizedError") {
    res.status(401)
    res.json({"message" : err.name + ": " + err.message})
  }
})

//renders the front end layout
app.get("/", (req,res) =>{
  res.render("layout", {})
})

//api routes
app.get('/api', (req, res) => {
  res.json("SnapMap Time!")
})

app.get('/api/users/id/:id', (req, res, next) => {
  User.findOne({_id: req.params.id}).then(user => {
    res.json(user)
  })
})

app.get('/api/users/:email', (req, res, next) => {
  User.findOne({email: req.params.email}).then(user => {
    res.json(user)
  })
})

app.get('/api/users', (req, res, next) =>{
  User.find({}).then(users =>{
    res.json(users)
  })
})
