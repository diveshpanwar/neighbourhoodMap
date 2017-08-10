// global variables
var map;
var markers = [];
var infoWindow;
var bounds;
var tinyResetter = {};
// tinyResetter remember the last clicked marker, i.e marker id and marker icon in order to reset the marker icon
var nav = $(".nav");
var mapContainer  = $(".map-container");
var locationArray = [
        {title: "Shimla, Himachal Pradesh", location: {lat: 31.104815, lng: 77.173403}, desc: "This is my residende.", id:0},
        {title: "Una, Himachal Pradesh", location: {lat: 31.468445, lng: 76.270775}, desc: "This is another district of Himachal Pradesh.", id:1},
        {title: "Kinnaur, Himachal Pradesh", location: {lat: 31.650958, lng: 78.475195}, desc: "This is another district of Himachal Pradesh.", id:2},
        {title: "Mandi, Himachal Pradesh", location: {lat: 31.589201, lng: 76.91821}, desc: "This is another district of Himachal Pradesh.", id:3},
        {title: "Bilaspur, Himachal Pradesh", location: {lat: 31.340693, lng: 76.68747}, desc: "This is another district of Himachal Pradesh.", id:4},
        {title: "Chamba, Himachal Pradesh", location: {lat: 32.553363, lng: 76.125808}, desc: "This is another district of Himachal Pradesh.", id:5},
        {title: "Kangra, Himachal Pradesh", location: {lat: 32.099803, lng: 76.269101}, desc: "This is another district of Himachal Pradesh.", id:6},
        {title: "Solan, Himachal Pradesh", location: {lat: 30.904486, lng: 77.096736}, desc: "This is a beautiful district of Himachal Pradesh.", id:7}
      ];
//function to add location to the observable locations array
var addLocation = function(data) {
  this.title = ko.observable(data.title);
  this.location = ko.observable(data.location);
  this.desc = ko.observable(data.desc);
  this.id = ko.observable(data.id);
};

//set the marker and add the window details...
var setWindowMarkerandDetails = function(marker, infoWindow) {
  if (tinyResetter.icon) {
    markers[tinyResetter.id].setIcon(tinyResetter.icon);
  }
  tinyResetter.icon = marker.getIcon();
  tinyResetter.id = marker.id;
  infoWindow.setContent('Loading Data...');
  var infoURL = "https://api.foursquare.com/v2/venues/search?ll="+marker.position.lat()+","+marker.position.lng()+"&query=food&v=20150609&limit=5&client_id=IT3ZFQCT45XJLD3D4ICFC1D2EL5XCHSBJ0T24Q4BICRSY0EE&client_secret=KUCRY3HL1QEXIYIX3JDCDEZIZS3ICSCYOIW5MJ4CVHYCHT44";
  var foodPoints = "";
    $.getJSON(infoURL, function(data) {
      var $venues = data.response.venues;
      if ($venues.length > 0) {
        $venues.forEach(function(venue) {
          foodPoints+='<li><strong>'+venue.name+'</strong></li>';
        });
      }else {
        foodPoints+='<h6>Sorry! No data available for this place.</h6>';
      }
    }).done(function() {
      infoWindow.setContent('<h3 class="text-center">'+marker.title+
      '</h3><h5>Position: '+marker.position+'</h5><hr class="gradient"><div><div class="text-left"><h4>Food Points</h4><ul>'+foodPoints+'</ul></div>');
    }).fail(function() {
      infoWindow.setContent('<h3 class="text-center">'+marker.title+
      '</h3><h5>Position: '+marker.position+'</h5><hr class="gradient"><div class="text-left"><h4>Food Points</h4><ul>Unable to Load Data at the Moment.</ul></div>');
    });

  if(infoWindow.marker != marker) {
     infoWindow.marker = marker;
     marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
     infoWindow.open(map, marker);
     infoWindow.addListener('closeclick', function() {
       infoWindow.marker = null;
     });
   }
};
//the view model
var ViewModel = function() {
  var self = this;
  this.locations = ko.observableArray([]);
  locationArray.forEach(function(location) {
    self.locations.push(new addLocation(location));
  });
  //query and filters with functionality to highlight the choosen markers with yellow
  this.query = ko.observable("");

  self.filterLocations = ko.dependentObservable(function() {
  		var search = this.query().toLowerCase();
  		return ko.utils.arrayFilter(self.locations(), function(location) {
        var id = location.id();
          if (search ==="") {
            if(markers[id])
            markers[id].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
          }
          else if (location.title().toLowerCase().indexOf(search) >= 0) {
            if(markers[id])
              markers[id].setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
          }else {
            if(markers[id])
              markers[id].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
          }
        return location.title().toLowerCase().indexOf(search) >= 0;
  		});
  	}, this);

  //show the info window when the list item is clicked
  self.popUpInfoWindow = function () {
    infoWindow = infoWindow || new google.maps.InfoWindow({
       content: "Loading Data..."
     });
    var marker = markers[this.id()];
         setWindowMarkerandDetails(marker, infoWindow);
         if (window.innerWidth <=950) {
           nav.hide();
           nav.css("width","24%");
           mapContainer.show();
         }
       };
};

ko.applyBindings(new ViewModel());

$(function() {
  //reload on window resize
  // $(window).resize(function(){location.reload();});
  //click on menu Icon
  $("#menuIcon").click(function() {
    nav.css("width","100%");
    mapContainer.hide();
    nav.show();
  });
  //click on the close button
  $("#close").click(function() {
    nav.css("width","24%");
    nav.hide();
    mapContainer.show();
  });

  if(!map) {
    $("#map").html('<h2 class="text-center text-danger"><span class="fa fa-warning"></span> Unable to load the map at the moment!</h2>');
  }
});

function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: {lat: 31.100142, lng: 77.120649},
        mapTypeConrol: true
      });
      infoWindow = infoWindow || new google.maps.InfoWindow({
       content: "Loading Data..."
     });
     bounds = new google.maps.LatLngBounds();
      for(var i = 0; i< locationArray.length; i++) {
        var position = locationArray[i].location;
        var title = locationArray[i].title;
        var marker = new google.maps.Marker({
          position: position,
          title: title,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          animation: google.maps.Animation.DROP,
          id: i,
          map: map
        });
        markers.push(marker);
        bounds.extend(markers[i].position);
      }
      markers.forEach(function(marker) {
        marker.addListener('click', function() {
          setWindowMarkerandDetails(this, infoWindow);
        });
      });
      map.fitBounds(bounds);
}
