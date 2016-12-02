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

//UTILIZE FILES IN PUBLIC FOLDER
app.use(express.static("public"));

//SET VIEW ENGINE TO HANDLEBARS
app.set("view engine", "hbs")

//SET UP PORT AND LISTEN TO SERVER --HEROKU WILL USE THE process.env.PORT
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


app.get('/api/markers', (req, res, next) =>{
  Marker.find({}).then(markers =>{
    res.json(markers)
  })
})

app.get('/api/markers/:id', (req, res, next) => {
  Marker.findOne({_id: req.params.id}).then(marker => {
    res.json(marker)
  })
})

app.get("/api/markers/:user", (req, res) =>{
  Marker.findOne({user: req.params.user}).then( marker =>{
    res.json(marker)
  })
})

app.post("/api/markers", (req, res)=>{
  Marker.create(req.body).then( marker =>{
    res.json(marker)
  })
})

app.put("/api/markers/:user", (req, res) =>{
  Marker.findOneAndUpdate({user: req.params.user}, req.body, {new:true}).then( marker =>{
    res.json(marker)
  })
})

app.delete("/api/markers/:user", (req,res) =>{
  Marker.findOneAndRemove({user: req.params.user}).then( _ =>{
    res.json({success: true})
  })
})
