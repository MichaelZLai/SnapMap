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
  .controller("navigation", [
    "$location",
    navigation
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







//=========================
//           MAP
//=========================
function mapController ($state, Marker) {
//global variables
var markers = []
var contents = []
var infowindows = []

function initMap() {

  // Defines Map and sets it to Mexico City
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 19.432608, lng: -99.133209},
    zoom: 4,
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
          console.log("Returned place contains no geometry");
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

//hardcoded mexico data
var mexico = [
  {user: "Michael Lai", desc: "atrio", lat: 19.434331, lng: -99.140164, imageurl: "https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/15068436_10154204506938790_8493317963348433027_o.jpg"},
  {user: "Michael Lai", desc: "zocalo", lat: 19.432602, lng: -99.133205, imageurl: "https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/14102928_10153961036873790_6301174510094312346_o.jpg"},
  {user: "Michael Lai", desc: "el rey statue", lat: 19.426504, lng: -99.137149, imageurl: "https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/14212656_10153999825623790_4612144961473900845_n.jpg?oh=d4eadae932da1bffc813f24af5de79fb&oe=58BB53F0"},
]
//function to find and set markers on map
function setMarkers(map) {
  for (var i = 0; i < mexico.length; i++) {
    //defines the image
    var image = {
      url: mexico[i].imageurl,
      scaledSize: new google.maps.Size(40, 40),
    };
    //defines the content inside the infowindow
    contents[i] =
    '<div id="content">'+
    '<img src="'+mexico[i].imageurl+'" style="width:400px;height:auto;">'+
    '<p>'+mexico[i].desc+'</p>'+
    '<p>by '+mexico[i].user+'</p>'
    '</div>';
    //defines infowindow
    infowindows[i] = new google.maps.InfoWindow({
      content: contents[i]
    });
    //identifies the marker to be placed
    markers[i] = new google.maps.Marker({
      position: {lat: mexico[i].lat, lng: mexico[i].lng},
      map: map,
      icon: image,
      title: mexico[i].title
    });
    //adds index property
    markers[i].index = i
    //adds a click feature to the marker for infowindow
    google.maps.event.addListener(markers[i],'click', function() {
      infowindows[this.index].open(map, markers[this.index]);
    });
  }
}
}
