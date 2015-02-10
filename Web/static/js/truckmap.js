var trailer_arr = [];
var len = 10;
var maxGen = 100;
var maxCon = 100;

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
	var trailerIcon_selected = new google.maps.MarkerImage("http://www.iconsfind.com/wp-content/uploads/2013/11/CarTrailer-icon.png", null, null, null, new google.maps.Size(25,25));
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
	for (var i = 0; i < len; i++) {
		trailer_arr.push({
			trailerId: i,
			latitude: latitude+(i+1)*getRandomArbitrary(-scale,scale),
			longitude: longitude+(i+1)*getRandomArbitrary(-scale,scale),
			Watth: getRandomArbitrary(0,1000),
			GenWatt: getRandomArbitrary(0,maxGen),
			ConWatt: getRandomArbitrary(0,maxCon),
			checked: true
		});
	}

	for (var i = 0; i < trailer_arr.length; i++) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(trailer_arr[i].latitude,trailer_arr[i].longitude),
			map: map,
			draggable: false,
			icon: trailerIcon_selected,
			title: "trailer-"+i,
			animation: google.maps.Animation.DROP,
			zindex:1
		});
		marker.setMap(map);

		google.maps.event.addListener(marker, 'click', function() {
			var key = parseInt(this.title.split('-')[1])
			if(trailer_arr[key].checked){
				trailer_arr[key].checked=false;
				this.icon = trailerIcon;
			}else{
				trailer_arr[key].checked=true;
				this.icon = trailerIcon_selected;
			}
			console.log(trailer_arr[key]);

			calculateChecked();

			this.setMap(map);
		});
	
		var contentString = ""
		var infowindow = new google.maps.InfoWindow({
				content: contentString,
				maxWidth: 200
		});	

		google.maps.event.addListener(marker, 'mouseover', function() {
			var key = parseInt(this.title.split('-')[1])
			var html = "<div>Trailer #" + (trailer_arr[key].trailerId+1) + "</div>";
			html += "<div>It has " + trailer_arr[key].Watth.toFixed(2) + "kWh</div>";
			html += "<div>It consumes " + trailer_arr[key].ConWatt.toFixed(2) + "kW</div>";
			html += "<div>It generates " + trailer_arr[key].GenWatt.toFixed(2) + "kW</div>";
			html += "<div>longitude: "+trailer_arr[key].longitude.toFixed(2)+", latitude: "+trailer_arr[key].latitude.toFixed(2)+"</div>"
			infowindow.content = html;
		    infowindow.open(map,this);
		});	

		google.maps.event.addListener(marker, 'mouseout', function() {
		    infowindow.close(map,this);
		});	
	}

	calculateChecked();
}

var num_of_cluster = 0;

function calculateChecked(){
	var totalWatth = 0;
	var html = "";
	var checked = 0;
	var totalGenWatt = 0;
	var totalConWatt = 0;

	num_of_cluster = 0;
	html += "<div>";
	for(var i=0; i<trailer_arr.length; i++){
		if(trailer_arr[i].checked){
			num_of_cluster++;

			checked = 1;
			totalWatth += trailer_arr[i].Watth;
			totalGenWatt += trailer_arr[i].GenWatt;
			totalConWatt += trailer_arr[i].ConWatt;

			html += "<div>Trailer #"
			html += (trailer_arr[i].trailerId+1)
			html += " has <b>"
			html += trailer_arr[i].Watth.toFixed(2)
			html += "</b>kWh</div>"
		}
	}
	html += "</div>";
	html += "<div><hr/>"
	html += "The trailers have total <b>"+totalWatth.toFixed(2)+"</b>kWh energy"
	html += "</div>"
	if(checked)
		$("#selected_trucks").html(html)
	else
		$("#selected_trucks").html("No trucks selected")

	console.log(totalWatth);

	gauge.setGenerationGauge(len*maxGen,totalGenWatt);
	gauge.setConsumptionGauge(len*maxCon,totalConWatt);

	var fyiMessage = "";
	if(num_of_cluster == 0 ){
		fyiMessage = "Please select trucks from map to monitor.";
	}else if(num_of_cluster == 1){
		fyiMessage = "You are now monitoring a truck.";
	}else{
		fyiMessage = "You are now monitoring " + num_of_cluster + " trucks cluster.";
	}
	$("#info-area").html("<div class='alert alert-info alert-dismissible' role='alert'><button class='close' type='button' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>FYI:&nbsp;</strong>" + fyiMessage + "</div>");
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