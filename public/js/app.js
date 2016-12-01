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
    "Marker",
    addPhotoController
  ])
  .controller("mapCtrl", [
    "$state",
    "Marker",
    mapController
  ])
  .directive("navigate",
    navigate
  )


function Router($stateProvider){
  $stateProvider
  .state("home", {
    url: "/",
    templateUrl: "./js/ng-views/home.html"
  })
  .state("map", {
    url: "/map",
    templateUrl: "./js/ng-views/map.html",
    controller: "mapCtrl",
    controllerAs: "vm"
  })
  .state("addPhoto", {
    url: "/addPhoto",
    templateUrl: "./js/ng-views/addPhoto.html",
    controller: "addPhotoCtrl",
    controllerAs: "vm"
  })
}

function Marker ($resource) {
  return $resource('/api/markers/:user', {}, {
    update: {method: 'PUT'}
  })
}

//logic for adding a photo form in addPhoto.html
function addPhotoController($state, $location, Marker) {
  var vm = this;
  vm.newMarker = new Marker()

  vm.onSubmitPhoto = photo =>{
    vm.newMarker.$save()
    .then( _ =>{
      $state.go("map")
    })
  }
}

//logic for rendering photos on map
function mapController($state, Marker){
  var vm = this;
  vm.markers = Marker.query({}).$promise.then( markerapi =>{
    setMap(markerapi)
    })
  }

//navigation directive
function navigate($location) {
  return {
    restrict: 'EA',
    templateUrl: './js/ng-views/navigation.html'
  };
}

//=========================
//           MAP
//=========================
//global variables
function setMap(markerapi){
var markers = []
var contents = []
var infowindows = []
var markerApiArr = markerapi
var map


//function to find and set markers on map
function setMarkers(map) {
  let mexico = markerApiArr;
  for (var i = 0; i < markerApiArr.length; i++) {
    //defines the image
    var image = {
      url: markerApiArr[i].imageurl,
      scaledSize: new google.maps.Size(40, 40),
    };
    //defines the content inside the infowindow
    contents[i] =
    '<div id="content">'+
    '<img src="'+markerApiArr[i].imageurl+'" style="width:400px;height:auto;">'+
    '<p>'+markerApiArr[i].desc+'</p>'+
    '<p>by '+markerApiArr[i].user+'</p>'
    '</div>';
    //defines infowindow
    infowindows[i] = new google.maps.InfoWindow({
      content: contents[i]
    });
    //identifies the marker to be placed
    markers[i] = new google.maps.Marker({
      position: {lat: markerApiArr[i].lat, lng: markerApiArr[i].lng},
      map: map,
      icon: image,
      title: markerApiArr[i].title
    });
    //adds index property
    markers[i].index = i
    //adds a click feature to the marker for infowindow
    google.maps.event.addListener(markers[i],'click', function() {
      infowindows[this.index].open(map, markers[this.index]);
    });
  }
}

function initMap() {

  // Defines Map and sets it to Mexico City
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 19.432608, lng: -99.133209},
    zoom: 3,
    mapTypeId: "roadmap"
  });
  //sets picture markers on the map
  setMarkers(map);

  //Allows autocompletion of a search
  function initAutocomplete() {
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // For the inputted place, redirect the map to that place
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          return;
        }

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }
  initAutocomplete()
}
initMap()
}
