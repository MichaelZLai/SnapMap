angular
  .module("snapmap", [
    "ui.router",
    "ngResource"
  ])
  .config([
    "$stateProvider",
    Router
  ])
  .service("authentication", [
    "$http",
    "$window",
    authentication
  ])
  .factory("User", [
    "$resource",
    User
  ])
  .factory("Marker", [
    "$resource",
    Marker
  ])

  function Router($stateProvider){
    console.log("router working")
    $stateProvider
    .state("map", {
      url: "/map",
      templateUrl: "./js/ng-views/map.html"
    })
    .state("home", {
      url: "/",
      templateUrl: "./js/ng-views/home.html",
      controller: "homeCtrl",
      controllerAs: "vm"
    })
    .state("login", {
      url: "/login",
      templateUrl: "./js/ng-views/login.html",
      controller: "loginCtrl",
      controllerAs: "vm"
    })
    .state("register", {
      url: "/register",
      templateUrl: "./js/ng-views/register.html",
      controller: "registerCtrl",
      controllerAs: "vm"
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

    return {
      saveToken : saveToken,
      getToken : getToken,
      logout : logout
    }
  }

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
    if(isLoggedIn()){
      var token = getToken();
      var payload = token.split(".")[1]
      payload = $window.atob(payload)
      payload = JSON.parse(payload)
      return{
        email : payload.email,
        name : payload.name
      };
    }
  }
//calling register api
  register = (user) =>{
    return $http.post("/api/register", user).success( data =>{
      saveToken(data.token);
    })
  }
//calling login api
  login = (user) =>{
    return $http.post("/api/login", user).success( data =>{
      saveToken(data.token);
    })
  }
//logic for register form in register.html
  function registerCtrl($location, authentication) {
    var vm = this;

    vm.credentials = {
      name : "",
      email : "",
      password : "",
    }

    vm.onSubmit = _ =>{
      authentication
        .register(vm.credentials)
        .error( err =>{
          alert(err);
        })
        .then( _ =>{
          $location.path("profile")
        })
    }
  }
//logic for login form in login.html
  function loginCtrl($location, authentication){
    var vm = this;

    vm.credentials = {
      email : "",
      password : "",
    }

    vm.onSubmit = _ =>{
      authentication
      .login(vm.credentials)
      .error( err =>{
        alert(err)
      })
      .then( _ =>{
        $location.path("profile")
      })
    }
  }

//change content based on user status
  function navigationCtrl($location, authentication){
    var vm = this;

    vm.isLoggedIn = authentication.isLoggedIn();
    vm.currentUser = authentication.currentUser();
  }
