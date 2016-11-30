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
  .controller("navigation", [
    "$location",
    "authentication",
    navigation
  ])
  .directive("navigate",
    navigate
  )


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
  .state("addPhoto", {
    url: "/addPhoto",
    templateUrl: "./js/ng-views/addPhoto.html",
    controller: "addPhoto",
    controllerAs: "vm"
  })
}


function Marker ($resource) {
  return $resource('http://localhost:5000/markers/:id', {}, {
    update: {method: 'put'},
    create: {method: 'post'}
  })
}


function authentication () {

  //calling register api
  addPhoto = (user) =>{
    return $http.post("http://localhost:5000/register", user).success( data =>{
      saveToken(data.token);
    })
  }
  return hi
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
