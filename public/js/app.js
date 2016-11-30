angular
.module("snapmap", [
  "ui.router",
  "ngResource"
])
.config([
  "$stateProvider",
  Router
])
.factory("Marker", [
  "$resource",
  Marker
])
.controller("addPhoto", [
  "$location",
  addPhoto
])
.controller("login", [
  "$location",
  "authentication",
  login
])
.controller("navigation", [
  "$location",
  "authentication",
  navigation
])
.directive("navigate", navigate)

function Router($stateProvider){
  console.log("router working")
  $stateProvider
  .state("map", {
    url: "/map",
    templateUrl: "./js/ng-views/map.html"
  })
  .state("home", {
    url: "/",
    templateUrl: "./js/ng-views/home.html"
  })
  .state("login", {
    url: "/login",
    templateUrl: "./js/ng-views/login.html",
    controller: "login",
    controllerAs: "vm"
  })
  .state("addPhoto", {
    url: "/addPhoto",
    templateUrl: "./js/ng-views/addPhoto.html",
    controller: "addPhoto",
    controllerAs: "vm"
  })
}

function User ($resource) {
  return $resource('http://localhost:5000/users/id/:id', {}, {
    update: {method: 'put'}
  })
}

function Marker ($resource) {
  return $resource('http://localhost:5000/markers/:id', {}, {
    update: {method: 'put'},
    create: {method: 'post'}
  })
}


function authentication ($http, $window) {
  var saveToken = (token) =>{
    $window.localStorage["mean-token"] = token
  };

  var getToken = _ =>{
    return $window.localStorage["mean-token"]
  };

  logout = _ =>{
    $window.localStorage.removeItem("mean-token")
  };

  var isLoggedIn = function(){
    var token = getToken()
    var payload
    if (token) {
      payload = token.split(".")[1]
      payload = $window.atob(payload)
      payload = JSON.parse(payload)
      return payload.exp > Date.now() / 1000
    } else {
      return false;
    }
  }
  //get current user's details
  var currentUser = function(){
    if (isLoggedIn()) {
      var token = getToken();
      var payload = token.split(".")[1]
      payload = $window.atob(payload)
      payload = JSON.parse(payload)
      console.log(payload)
      console.log(payload.email)
      return{
        email : payload.email,
        name : payload.name
      };
    }
  }
  //calling register api
  addPhoto = (user) =>{
    return $http.post("http://localhost:5000/register", user).success( data =>{
      saveToken(data.token);
    })
  }
  //calling login api
  login = (user) =>{
    return $http.post("http://localhost:5000/login", user).success( data =>{
      saveToken(data.token);
    })
  }

  logout = function() {
    $window.localStorage.removeItem('mean-token');
  };

  return {
    saveToken : saveToken,
    getToken : getToken,
    logout : logout,
    isLoggedIn : isLoggedIn,
    currentUser : currentUser,
    register : register,
    login : login
  }
}

//logic for adding a photo form in addPhoto.html
function addPhoto($location, authentication) {
  console.log("Add Photo controller");
  var vm = this;

  vm.photo = {
    user : "",
    imageurl : "",
    lat : "",
    lng : "",
    desc : ""
  }

  vm.onSubmit = () =>{
    authentication
    .register(vm.photo)
    .error( err =>{
      alert(err);
    })
    .then( () =>{
      $location.path("map")
    })
  }
}
//logic for login form in login.html
function login($location, authentication){
  var vm = this;

  vm.credentials = {
    email : "",
    password : "",
  }

  vm.onSubmit = _ =>{
    authentication
    .login(vm.credentials)
    .error( (err) =>{
      alert(err)
    })
    .then( (token) =>{
      $location.path("map")
    })
  }
}
//navigation directive
function navigate($location) {
  return {
    restrict: 'EA',
    templateUrl: './js/ng-views/navigation.html',
    controller: 'navigation',
    controllerAs: 'navvm'
  };
}
//change content based on user status
function navigation($location, authentication){
  var vm = this;
  vm.isLoggedIn = authentication.isLoggedIn();
  vm.currentUser = authentication.currentUser();
}
