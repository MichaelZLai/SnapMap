// Defines Map and sets it to Mexico City
  function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 19.432608, lng: -99.133209},
      zoom: 14,
      mapTypeId: "terrain"
    });

    // var mexico1 = {lat: 19.434331, lng: -99.140164};
    // var mexico2 = {lat: 19.432602, lng: -99.133205};
    //
    //
    // var mexico1img = {
    //   url: "https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/15068436_10154204506938790_8493317963348433027_o.jpg",
    //   scaledSize: new google.maps.Size(40, 40),
    // };
    // var mexico2img = {
    //   url: "https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/14102928_10153961036873790_6301174510094312346_o.jpg",
    //   scaledSize: new google.maps.Size(40, 40),
    // };
    //
    //
    // var marker1 = new google.maps.Marker({
    //   position: mexico1,
    //   map: map,
    //   icon: mexico1img
    // });
    // var marker2 = new google.maps.Marker({
    //   position: mexico2,
    //   map: map,
    //   icon: mexico2img
    // });
    // var contentString =
    //   '<div id="content">'+
    //   '<img src="https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/14102928_10153961036873790_6301174510094312346_o.jpg" style="width:400px;height:auto;">'+
    //   '</div>';
    //
    // var infowindow = new google.maps.InfoWindow({
    //   content: contentString
    // });
    // marker2.addListener('click', function() {
    // infowindow.open(map, marker2);
    // });
    //sets the markers on the map
    setMarkers(map);
  }

  var mexico = [
    {title: "atrio", lat: 19.434331, lng: -99.140164, url: "https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/15068436_10154204506938790_8493317963348433027_o.jpg"},
    {title: "zocalo", lat: 19.432602, lng: -99.133205, url: "https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/14102928_10153961036873790_6301174510094312346_o.jpg"},
  ]
  //global variables
  var markers = []
  var contents = []
  var infowindows = []

  function setMarkers(map) {
        for (var i = 0; i < mexico.length; i++) {
          //defines the image
          var image = {
            url: mexico[i].url,
            scaledSize: new google.maps.Size(40, 40),
          };
          //defines the content inside the infowindow
          contents[i] =
            '<div id="content">'+
            '<img src="'+mexico[i].url+'" style="width:400px;height:auto;">'+
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
