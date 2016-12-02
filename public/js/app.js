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
    "$scope",
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
function addPhotoController($state,$scope, Marker) {
  var vm = this;
  vm.newMarker = new Marker()
  vm.onSubmitPhoto = _ =>{
    if($scope.addPhoto.$valid){
      vm.onSubmitPhoto = photo =>{
        vm.newMarker.$save()
        .then( _ =>{
          $state.go("map")
        })
      }
    }
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
    '<h4>'+markerApiArr[i].desc+'</h4>'+
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

//initializes the map
function initMap() {
  var flatmap = new google.maps.StyledMapType(
    [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#6195a0"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":"0"},{"saturation":"0"},{"color":"#f5f5f2"},{"gamma":"1"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"lightness":"-3"},{"gamma":"1.00"}]},{"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#bae5ce"},{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#fac9a9"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#787878"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"transit.station.airport","elementType":"labels.icon","stylers":[{"hue":"#0a00ff"},{"saturation":"-77"},{"gamma":"0.57"},{"lightness":"0"}]},{"featureType":"transit.station.rail","elementType":"labels.text.fill","stylers":[{"color":"#43321e"}]},{"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"hue":"#ff6c00"},{"lightness":"4"},{"gamma":"0.75"},{"saturation":"-68"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eaf6f8"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c7eced"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":"-49"},{"saturation":"-53"},{"gamma":"0.79"}]}]
  )
  // Defines Map
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 36.162664, lng: -86.781602},
    zoom: 5,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain','flatmap']
    }
  });
  //associate custom styled map (flatmap) and set it to display
  map.mapTypes.set('flatmap', flatmap);
  map.setMapTypeId('flatmap');

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
