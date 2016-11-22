// Defines Map and sets it to Washington DC
  var map;
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.9072, lng: -77.0369},
      zoom: 14,
      mapTypeId: 'roadmap'
    });
  }
