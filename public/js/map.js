// Defines Map and sets it to Mexico City
  function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 19.432608, lng: -99.133209},
      zoom: 11,
      mapTypeId: "terrain"
    });

    // var mexico = [
    //   {title: "atrio", lat: 19.434331, lng: -99.140164, url: "https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/15068436_10154204506938790_8493317963348433027_o.jpg"},
    //   {title: "atrio", lat: 19.434331, lng: -99.140164, url: "https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/15068436_10154204506938790_8493317963348433027_o.jpg"},
    //   {title: "atrio", lat: 19.434331, lng: -99.140164, url: "https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/15068436_10154204506938790_8493317963348433027_o.jpg"},
    // ] 
    var mexico1 = {lat: 19.434331, lng: -99.140164};
    var mexico2 = {lat: 19.432602, lng: -99.133205};
    var mexico3 = {lat: 19.257231, lng: -99.102966};

    var mexico1img = {
      url: "https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/15068436_10154204506938790_8493317963348433027_o.jpg",
      scaledSize: new google.maps.Size(40, 40),
    };
    var mexico2img = {
      url: "https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/14102928_10153961036873790_6301174510094312346_o.jpg",
      scaledSize: new google.maps.Size(40, 40),
    };
    var mexico3img = {
      url: "https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/14205926_10153980879803790_1686706604453680293_o.jpg",
      scaledSize: new google.maps.Size(40, 40),
    };

    var marker1 = new google.maps.Marker({
      position: mexico1,
      map: map,
      icon: mexico1img
    });
    var marker2 = new google.maps.Marker({
      position: mexico2,
      map: map,
      icon: mexico2img
    });
    var marker3 = new google.maps.Marker({
      position: mexico3,
      map: map,
      icon: mexico3img
    });
    var contentString =
      '<div id="content">'+
      '<img src="https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/14205926_10153980879803790_1686706604453680293_o.jpg" style="width:400px;height:auto;">'+
      '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    marker3.addListener('click', function() {
    infowindow.open(map, marker3);
    });
  }
