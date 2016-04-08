
/* Constants */
var dataType = ["pickup_count",
		"pickup_passenger_count",
		"pickup_total_distance",
		"pickup_total_fee",
		"dropoff_count",
		"dropoff_passenger_count",
		"dropoff_total_distance",
		"dropoff_total_fee"];

var dataSrc = 'data/' + dataType[0] + '/24.js';

var defaultPosition = [40.7127, -74.0059];

// This part should be same as Helper.java
var northest = 41.0;
var southest = 40.4;
var eastest = -73.69;
var westest = -74.26;
var lonStep = 4.49660803E-4; // 50m
var latStep =  4.49660803E-4; // 50m
var lonStepNum = Math.floor(((eastest - westest) / lonStep) + 1);

// The gradient color list
// RGB: 0,0,255 -> 0,255,255 -> 255,255,0 -> 255,0,0
var colors = [
    '#0000FF','#0007FF','#000FFF','#0017FF','#001EFF',
    '#0026FF','#002EFF','#0036FF','#003DFF','#0045FF',
    '#004DFF','#0055FF','#005CFF','#0064FF','#006CFF',
    '#0073FF','#007BFF','#0083FF','#008BFF','#0092FF',
    '#009AFF','#00A2FF','#00AAFF','#00B1FF','#00B9FF',
    '#00C1FF','#00C8FF','#00D0FF','#00D8FF','#00E0FF',
    '#00E7FF','#00EFFF','#00F7FF','#00FFFF','#07FFF7',
    '#0FFFEF','#17FFE7','#1EFFE0','#26FFD8','#2EFFD0',
    '#36FFC8','#3DFFC1','#45FFB9','#4DFFB1','#55FFAA',
    '#5CFFA2','#64FF9A','#6CFF92','#73FF8B','#7BFF83',
    '#83FF7B','#8BFF73','#92FF6C','#9AFF64','#A2FF5C',
    '#AAFF55','#B1FF4D','#B9FF45','#C1FF3D','#C8FF36',
    '#D0FF2E','#D8FF26','#E0FF1E','#E7FF17','#EFFF0F',
    '#F7FF07','#FFFF00','#FFF700','#FFEF00','#FFE700',
    '#FFE000','#FFD800','#FFD000','#FFC800','#FFC100',
    '#FFB900','#FFB100','#FFAA00','#FFA200','#FF9A00',
    '#FF9200','#FF8B00','#FF8300','#FF7B00','#FF7300',
    '#FF6C00','#FF6400','#FF5C00','#FF5500','#FF4D00'
];


/* Main */
setupMap();
loadData(dataSrc);


/* Functions */
var map; // Global map object

function setupMap() {
    map = L.map('mapid').setView(defaultPosition, 11);
    var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?'
	+ 'access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
    var mbAttr =
	{
	    maxZoom: 18,
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery &copy <a href="http://mapbox.com">Mapbox</a>',
	    id: 'mapbox.streets'
	};
    L.tileLayer(mbUrl, mbAttr).addTo(map);
}

function loadData(src) {
    var dataScript = document.createElement('script');
    dataScript.type = "text/javascript";
    dataScript.src = src;
    document.body.appendChild(dataScript);
    dataScript.onload = function () {
	alert(currentData);
	drawData();
    };
}

function drawData() {
    max = findMax(data);
    min = findMin(data);
    function idToCoord(id) {
	latN = Math.floor(id / lonStepNum);
	lonN = Math.floor(id % lonStepNum);
	v1_lat = latN * latStep + southest;
	v1_lon = lonN * lonStep + westest;
	v2_lon = v1_lon + lonStep;
	v2_lat = v1_lat + latStep;
	return [[v1_lat, v1_lon],
		[v2_lat, v2_lon]];
    }
    function valToColor(val) {
	var step = (max-min)/colors.length;
	return colors[Math.floor((val-min)/step)];
    }
    var length = data.length;
    for (var i = 0; i < length; i++) {
	L.rectangle(idToCoord([data[i][0]]),
		    {
			fillOpacity: 0.45,
			stroke: false,
			fill: true,
			color: valToColor(data[i][1])
		    })
	    .addTo(map)
	    .bindPopup(data[i][1]+ " " +valToColor(data[i][1]));
    }
}

function findMax(l) {
    var max;
    for (var i = 0; i < l.length; i++) {
	if (max == undefined || max < l[i][1]) {
	    max = l[i][1];
	}
    }
    return max;
}

function findMin(l) {
    var min;
    for (var i = 0; i < l.length; i++) {
	if (min == undefined || min > l[i][1]) {
	    min = l[i][1];
	}
    }
    return min;
}


