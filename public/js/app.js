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
  .controller("addPhotoCtrl", [
    "$state",
    "$location",
    "addPhoto",
    addPhotoController
  ])
  .controller("navigation", [
    "$location",
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
    controller: "addPhotoCtrl",
    controllerAs: "vm"
  })
}

function Marker ($resource) {
  return $resource('http://localhost:5000/markers/:id', {}, {
    update: {method: 'put'},
    create: {method: 'post'},
    delete: {method: 'delete'}
  })
}

//UP FOR DELETION
function authentication () {

  return hi
}

//logic for adding a photo form in addPhoto.html
function addPhotoController($location, $state, Marker) {
  var vm = this;

  vm.markers = Markers.query()
  vm.newMarker = new Marker()

  vm.onSubmitPhoto = _ =>{
    vm.newMarker.$save()
      .error( err =>{
        alert(err)
      })
      .then( marker =>{
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
function navigation($location){
  var vm = this;
}
