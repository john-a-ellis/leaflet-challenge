// Create the tile layer that will be the background of our map.


let myLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function chooseColor(depth) {
    if (depth >= 90) return "darkred";
    else if (depth >= 70) return "orangered";
    else if (depth >= 50) return "orange";
    else if (depth >= 30) return "yellow";
    else if (depth >= 10)  return "yellowgreen";
    else return "palegreen";
}

function chooseRadius(mag) {
    return 10
}
var geojsonMarkerOptions = {
    radius: 5,
    fillColor: 'blue',
    color: 'black',
    fillOpacity: 0.5,
    weight: 0.7
}

d3.json(myLink).then(function(data) {

    createFeatures(data.features);
});
function onEachFeature(feature, layer){
    layer.bindPopup('<h3>' + feature.properties.place + '</h3><hr><p><b>Date of Event: </b>' + new Date(feature.properties.time)
    + '<br><b>Magnitude: <b>' + feature.properties.mag + '<br><b>Depth: </b>' + feature.geometry.coordinates[2] + '</p>');

        L.circle.fillColor = chooseColor(feature.geometry.coordinates[2]);
    // L.circle.color = chooseColor(feature.geometry.coordinates[2]);
    L.circle.radius = feature.properties.mag;
}
    // console.log(data.feature[0].geometry.coordinates);
function createFeatures(earthquakeData){
    
    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer:function(feature,latlng){
            
            myMarker = (L.circleMarker(latlng, geojsonMarkerOptions));

            myMarker.bindTooltip('<p><b>Location:</b>' + feature.properties.place + '<br><b>Magnitude: <b>' + feature.properties.mag + 
            '<br><b>Depth: </b>' + feature.geometry.coordinates[2] + '</p>').openTooltip();      

            return myMarker;
        },
        style: function(feature) {
            return{
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                // color: chooseColor(feature.geometry.coordinates[2]),
                radius: feature.properties.mag**2
            }
        },
        onEachFeature:onEachFeature
    });
    
    createMap(earthquakes);
}

function createMap(earthquakes){
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    let overlayMaps = {
        Earthquakes: earthquakes
    };
    
    let myMap = L.map("map", {
        center: [
          0, 0
        ],
        zoom: 3,
        layers: [street, earthquakes]
      });
    
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    L.control.scale(metric=true).addTo(myMap)

    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let entries = [
                    {range:'-10-10',
                    color:'palegreen'},
                    {range:'10-30',
                    color:'yellowgreen'},
                    {range: '30-50',
                    color:'yellow'},
                    {range: '50-70',
                    color: 'orange'},
                    {range: '70-90',
                    color: 'orangered'},
                    {range: '90+',
                    color: 'darkred'}
                ];
    let labels = [];
    // Add the minimum and maximum.
    let legendInfo = ""
        

    div.innerHTML = legendInfo;
    labels.push('<th style=text-align:center><b>Earthquake Depth</b><br>(Kilometers)</th>')
    entries.forEach(function(range, index) {
        labels.push("<tr><td style=\"background-color: " + entries[index].color + "\">" + entries[index].range + "</td></tr>");
    });

    div.innerHTML += "<table id = 'legend'>" + labels.join("") + "</table>";
    return div;
    };

    // Adding the legend to the map
    legend.addTo(myMap);

}
    
 

