var map, searchManager;
var BingMapsKey = 'AuV6Kc6hF3yFNL_DXFTDGuSu9DCdIK8zYF208z0eNdqbXtt87UHslIKJ70900Wbj';
let data = ""
const longlat = [34.888634, -81.304888, 35.579597, -80.360028]

function GetMap() {
    map = new Microsoft.Maps.Map('#myMap', {
        credentials: BingMapsKey
    });

    //Load the spatial math module
    Microsoft.Maps.loadModule("Microsoft.Maps.SpatialMath", function () {
        //Request the user's location
        navigator.geolocation.getCurrentPosition(function (position) {
            var loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);

            //Create an accuracy circle
            var path = Microsoft.Maps.SpatialMath.getRegularPolygon(loc, position.coords.accuracy, 36, Microsoft.Maps.SpatialMath.Meters);
            var poly = new Microsoft.Maps.Polygon(path);
            map.entities.push(poly);

            //Add a pushpin at the user's location.
            var pin = new Microsoft.Maps.Pushpin(loc);
            map.entities.push(pin);

            //Center the map on the user's location.
            map.setView({ center: loc, zoom: 17 });
        });
    });
}

function geocode() {
    var query = document.getElementById('input').value;

    var geocodeRequest = "http://dev.virtualearth.net/REST/v1/LocalSearch/?query=" + encodeURIComponent(query) + "&userMapView=" + encodeURIComponent(longlat) + "&maxResults=25&jsonp=GeocodeCallback&key=" + BingMapsKey;

    CallRestService(geocodeRequest, GeocodeCallback);
}

function GeocodeCallback(response) {
    var output = document.getElementById('output');

    if (response &&
        response.resourceSets &&
        response.resourceSets.length > 0 &&
        response.resourceSets[0].resources) {

        var results = response.resourceSets[0].resources;

        var html = ['<table><tr><td>Name</td><td>Phone</td><td>Website</td></tr>'];

        for (var i = 0; i < results.length; i++) {
            html.push('<tr><td>', results[i].name, '</td><td>', results[i].PhoneNumber, '</td><td>', results[i].Website, '</td></tr>');
            data += results[i].PhoneNumber + "\n"
            data += results[i].name + "\n"//Save Data into file
            data += "\n"
        }

        html.push('</table>');

        output.innerHTML = html.join('');

    } else {
        output.innerHTML = "No results found.";
    }
}

let WriteToFile = () => {

    // Convert the text to BLOB.
    const textToBLOB = new Blob([data], { type: 'text/plain' });
    const sFileName = 'formData.txt';	   // The file to save the data.

    let newLink = document.createElement("a");
    newLink.download = sFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }

    newLink.click(); 
}

function CallRestService(request) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", request);
    document.body.appendChild(script);
}
