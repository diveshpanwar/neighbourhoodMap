// global variables
var map;
var markers = [];
var infoWindow;

var locationArray = [
        {title: "Persenni Cottage", location: {lat: 31.100142, lng: 77.120649}, desc: "This is my residende.", id:0},
        {title: "Shishu Shiksha Niketan", location: {lat: 31.10073, lng: 77.121685}, desc: "This is my first school.", id:1},
        {title: "K.V Jutogh Cantt.", location: {lat: 31.098916, lng: 77.11202}, desc: "This is my second school.", id:2},
        {title: "UIIT", location: {lat: 31.111849, lng: 77.134784}, desc: "This is my university.", id:3},
        {title: "The Mall", location: {lat: 31.104805, lng: 77.173396}, desc: "This is for the street view.", id:4}
      ];

var addLocation = function(data) {
  this.title = ko.observable(data.title);
  this.location = ko.observable(data.location);
  this.desc = ko.observable(data.desc);
  this.id = ko.observable(data.id);
};

var ViewModel = function() {
  var self = this;
  this.locations = ko.observableArray([]);
  locationArray.forEach(function(location) {
    self.locations.push(new addLocation(location));
  });
  self.popUpInfoWindow = function () {
    infoWindow = infoWindow || new google.maps.InfoWindow({
       content: "dummy"
     });
    var marker = markers[this.id()];
         infoWindow.setContent('<div>'+marker.title+'</div><div>'+marker.position+'</div><div>'+marker.desc+'</div>');
         if(infoWindow.marker != marker) {
            infoWindow.marker = marker;
            // marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
            infoWindow.open(map, marker);
            infoWindow.addListener('closeclick', function() {
              infoWindow.marker = null;
            });
          }
          if (window.innerWidth <=950) {
            $(".nav").hide(500);
            $(".nav").css("width","24%");
            $(".map-container").show(500);
          }
       };
};

ko.applyBindings(new ViewModel());
$(function() {

  //reload on window resize
  $(window).resize(function(){location.reload();});
  //click on menu Icon
  $("#menuIcon").click(function() {
    console.log("click");
    $(".map-container").fadeOut("slow");
    $(".nav").css("width","100%");
    $(".nav").show(500);
  });
  //click on the close button
  $("#close").click(function() {
    $(".nav").hide(500);
    $(".nav").css("width","24%");
    $(".map-container").show(500);
  });

});

function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: {lat: 31.100142, lng: 77.120649},
        mapTypeConrol: true
      });
      infoWindow = infoWindow || new google.maps.InfoWindow({
       content: "dummy"
     });
      for(var i = 0; i< locationArray.length; i++) {
        var position = locationArray[i].location;
        var title = locationArray[i].title;
        var desc = locationArray[i].desc;
        var marker = new google.maps.Marker({
          position: position,
          title: title,
          animation: google.maps.Animation.DROP,
          id: i,
          desc: desc,
          map: map
        });
        markers.push(marker);
        marker.addListener('click', function() {
          populateInfoWindow(this, infoWindow);
        });
      }
    }

     function populateInfoWindow(marker, infoWindow) {
       console.log(marker);
       infoWindow.setContent('<div>'+marker.title+'</div><div>'+marker.position+'</div><div>'+marker.desc+'</div>');
       if(infoWindow.marker != marker) {
          infoWindow.marker = marker;
          // marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
          infoWindow.open(map, marker);
          infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
          });
        }
     }
