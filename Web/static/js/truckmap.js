var trailer_arr = [];
var len = 10;

function initialize() {
	var geolocation = navigator.geolocation;
	geolocation.getCurrentPosition(showLocation, errorHandler);
}

function showLocation( position ) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	var mapOptions = {
		center: new google.maps.LatLng(latitude, longitude),
		zoom: 12,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var trailerIcon = new google.maps.MarkerImage("http://www.ridgebacklighting.com/wp-content/uploads/2014/09/trailer-icon.png", null, null, null, new google.maps.Size(25,25));
	var myIcon = new google.maps.MarkerImage("http://img3.wikia.nocookie.net/__cb20140427224234/caramelangel714/images/7/72/Location_Icon.png", null, null, null, new google.maps.Size(28,44));
	
	var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(latitude,longitude),
		map: map,
		draggable: false,
		icon: myIcon,
		title:"Your location",
		animation: google.maps.Animation.DROP,
		zindex:2
	}).setMap(map);

	var scale = 0.006;
	for (var i = 1; i <= len; i++) {
		trailer_arr.push({
			trailerId: i,
			latitude: latitude+i*getRandomArbitrary(-scale,scale),
			longitude: longitude+i*getRandomArbitrary(-scale,scale),
			Watth: getRandomArbitrary(0,1000),
			checked: false
		});
	}

	for (var i = 0; i < trailer_arr.length; i++) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(trailer_arr[i].latitude,trailer_arr[i].longitude),
			map: map,
			draggable: true,
			icon: trailerIcon,
			title: "trailer-"+(i+1),
			animation: google.maps.Animation.DROP,
			zindex:1
		});
		marker.setMap(map);

		google.maps.event.addListener(marker, 'click', function() {
			var key = parseInt(this.title.split('-')[1])
			console.log(i)
			
			if(trailer_arr[key].checked)
				trailer_arr[key].checked=false;
			else
				trailer_arr[key].checked=true;

			console.log(trailer_arr[key])


		});
	}
}

function errorHandler( err ) {
	if (err.code == 1) {
	    // access is denied
	}
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}