
/* Constants */
var defaultPosition = [40.7325, -73.9559]; // New York

var dataType = ["pickup_count",
		"pickup_passenger_count",
		"pickup_total_distance",
		"pickup_total_fee",
		"dropoff_count",
		"dropoff_passenger_count",
		"dropoff_total_distance",
		"dropoff_total_fee"];

// This part should be same as Helper.java
var northest = 41.0;
var southest = 40.4;
var eastest = -73.69;
var westest = -74.26;
var lonStep = 4.49660803E-4; // 50m
var latStep =  4.49660803E-4; // 50m
var lonStepNum = Math.floor(((eastest - westest) / lonStep) + 1);

/* Main */
setupMap();
initialize();

/* Functions */
var map; // Global map object
var heatmap;

function setupMap() {
    map = L.map('map').setView(defaultPosition, 11);
    var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?'
	+ 'access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
    var mbAttr =
	{
	    maxZoom: 16,
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery &copy <a href="http://mapbox.com">Mapbox</a>',
	    id: 'mapbox.streets'
	};
    L.tileLayer(mbUrl, mbAttr).addTo(map);
}

function initialize() {
    var today = new Date();
    var sd = document.getElementById("selectDay");
    sd.selectedIndex = today.getDay();
    var st = document.getElementById("selectTime");
    st.selectedIndex = today.getHours() * 2 + today.getMinutes() / 30;
    refresh();
}

function loadData(src) {
    var dataScript = document.createElement('script');
    dataScript.type = "text/javascript";
    dataScript.src = src;
    document.body.appendChild(dataScript);
    dataScript.onload = function () {
	console.log(currentData);
	drawData();
    };
}

function refresh() {
    var type = getRadioValue("dataType");
    var sd = document.getElementById("selectDay");
    var d = parseInt(sd.options[sd.selectedIndex].value);
    var st = document.getElementById("selectTime");
    var t = parseInt(st.options[st.selectedIndex].value);
    var fname = d * 48 + t;
    var dataSrc = "data/" + type + "/" + fname + ".js";
    loadData(dataSrc);
}

function drawData() {
    function computePoint(data) {
	id = data[0];
	latN = Math.floor(id / lonStepNum);
	lonN = Math.floor(id % lonStepNum);
	v1_lat = latN * latStep + southest;
	v1_lon = lonN * lonStep + westest;
	v2_lon = v1_lon + lonStep;
	v2_lat = v1_lat + latStep;
	return [(v1_lat + v2_lat)/2,
		(v1_lon + v2_lon)/2,
	        data[1]];
    }
    var length = data.length;
    var dataPoints = Array.apply(null, Array(length)).map(function () {});
    for (var i = 0; i < length; i++) {
	dataPoints[i] = computePoint(data[i]);
    }
    if (map.hasLayer(heatmap))
	map.removeLayer(heatmap);
    heatmap = L.webGLHeatmap({
	size: 50,
	opacity: 0.4,
	units : 'px',
	alphaRange: 0.01,
    });
    heatmap.setData(dataPoints);

    var type = getRadioValue("dataType");
    if (type == dataType[2] || type == dataType[6]) {
	heatmap.multiply(1000000/(max-min));
    }
    else if (type == dataType[3] || type == dataType[7]) {
	heatmap.multiply(2000/(max-min));
    }
    else {
	heatmap.multiply(20/(max-min));
    }
    map.addLayer(heatmap);
}

function getRadioValue(group) {
    var elements = document.getElementsByName(group);
    for (var i = 0, l = elements.length; i < l; i++) {
        if (elements[i].checked) {
            return elements[i].value;
        }
    }
    return null;
}
