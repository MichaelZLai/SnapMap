var express       = require("express");
var path          = require("path");
var app           = express();
var mongoose      = require("./db/connection");
var models        = require("./db/models");
var bodyParser    = require("body-parser");
var Marker        = mongoose.model("Marker");
var router        = express.Router();


//use body-parser for handlebars and generating api responses
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json({extended:true}))

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

//UTILIZE FILES IN PUBLIC FOLDER
app.use(express.static("public"));

//SET VIEW ENGINE TO HANDLEBARS
app.set("view engine", "hbs")

//SET UP PORT AND LISTEN TO SERVER
app.set("port", process.env.PORT || 5000)
app.listen(app.get("port"), _ => {
  console.log("Consequences....")
})

//RENDERS FRONT END THROUGH HBS TO ANGULAR
app.get("/", (req,res) =>{
  res.render("layout", {})
})

//API ROUTES
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
