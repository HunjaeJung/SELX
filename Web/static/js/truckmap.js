var trailer_arr = [];
var len = 10;
var maxGen = 100;
var maxCon = 100;
var maxBat = 1000;
var markers = [];
var map;
var trailerIcon;
var trailerIcon_selected;

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

	trailerIcon = new google.maps.MarkerImage("/static/images/truck_default.png", null, null, null, new google.maps.Size(25,25));
	trailerIcon_selected = new google.maps.MarkerImage("/static/images/truck_selected.png", null, null, null, new google.maps.Size(25,25));
	var myIcon = new google.maps.MarkerImage("/static/images/marker_red.png", null, null, null, new google.maps.Size(28,44));

	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
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
			Watth: getRandomArbitrary(0,maxBat),
			GenWatt: getRandomArbitrary(0,maxGen),
			ConWatt: getRandomArbitrary(0,maxCon),
			checked: true
		});
	}

	for (var i = 0; i < trailer_arr.length; i++) {

		createCheckboxes();
		checkedChange();

		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(trailer_arr[i].latitude,trailer_arr[i].longitude),
			map: map,
			draggable: false,
			icon: trailerIcon_selected,
			title: "trailer-"+i,
			animation: google.maps.Animation.DROP,
			zindex:1
		});
		markers.push(marker);
		marker.setMap(map);

		google.maps.event.addListener(marker, 'click', function() {
			var key = parseInt(this.title.split('-')[1])
			if(trailer_arr[key].checked){
				trailer_arr[key].checked=false;
				this.icon = trailerIcon;
				document.getElementById("trailer_check-"+key).checked=false;
			}else{
				trailer_arr[key].checked=true;
				this.icon = trailerIcon_selected;
				document.getElementById("trailer_check-"+key).checked=true;
			}

			checkedChange();

			this.setMap(map);
		});

		var contentString = ""
		var infowindow;

		google.maps.event.addListener(marker, 'mouseover', function() {
			infowindow = new google.maps.InfoWindow({
				content: contentString,
				maxWidth: 200
			});    
			var key = parseInt(this.title.split('-')[1]);
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
}

function createCheckboxes(){
	var html = "";
	html += "<div>";
	for(var i=0;i<trailer_arr.length;i++){
		html += "<div>";
		if(trailer_arr[i].checked){
			html += "<input type='checkbox' class='trailer_checkbox' checked=true id='trailer_check-"+i+"'/>";
		}else{
			html += "<input type='checkbox' class='trailer_checkbox' checked=false id='trailer_check-"+i+"'/>";
		}
		html += "Trailer #"
		html += (trailer_arr[i].trailerId+1)
		html += " has <b>"
		html += trailer_arr[i].Watth.toFixed(2)
		html += "</b>kWh</div>"
	}

	$("#selected_trucks").html(html);

	$(".trailer_checkbox").change(function(){
		key = parseInt(this.id.split('-')[1]);
		if(this.checked){
			trailer_arr[key].checked=true;
			markers[key].icon = trailerIcon_selected;
		}else{
			trailer_arr[key].checked=false;
			markers[key].icon = trailerIcon;
		}

		markers[key].setMap(map);
		checkedChange();
	})
}

var num_of_cluster = 0;
function checkedChange(){
	var totalWatth = 0;
	var html = "";
	var checked = 0;
	var totalGenWatt = 0;
	var totalConWatt = 0;

	num_of_cluster = 0;
	for(var i=0; i<trailer_arr.length; i++){
		if(trailer_arr[i].checked){
			num_of_cluster++;

			checked = 1;
			totalWatth += trailer_arr[i].Watth;
			totalGenWatt += trailer_arr[i].GenWatt;
			totalConWatt += trailer_arr[i].ConWatt;
		}
	}

	html += "<hr/>"
	if(num_of_cluster==0){
		html += "No trailers selected";
	}else if(num_of_cluster==1){
		html += num_of_cluster + " trailer have <b>"+totalWatth.toFixed(2)+"</b>kWh energy"
	}else{
		html += num_of_cluster + " trailers have total <b>"+totalWatth.toFixed(2)+"</b>kWh energy"
	}
	$("#summary_trucks").html(html)

	gauge.setGenerationGauge(num_of_cluster*maxGen,totalGenWatt);
	gauge.setConsumptionGauge(num_of_cluster*maxCon,totalConWatt);
	gauge.setBatteryGauge(num_of_cluster*maxBat,totalWatth)

	var fyiMessage = "";
	if(num_of_cluster == 0 ){
		fyiMessage = "Please select trucks from map to monitor.";
		blurryCharts(true);
	}else if(num_of_cluster == 1){
		fyiMessage = "You are now monitoring a truck.";
		blurryCharts(false);
	}else{
		fyiMessage = "You are now monitoring " + num_of_cluster + " trucks cluster.";
		blurryCharts(false);
	}
	fyiAlert(fyiMessage);
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
