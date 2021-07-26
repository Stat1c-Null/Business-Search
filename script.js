var map, searchManager;
var BingMapsKey = 'AuV6Kc6hF3yFNL_DXFTDGuSu9DCdIK8zYF208z0eNdqbXtt87UHslIKJ70900Wbj';
let data = ""
let userLat , userLong, updatedLat, updatedLong

function GetMap() {
    map = new Microsoft.Maps.Map('#myMap', {
        credentials: BingMapsKey
    });

    //Load the spatial math module
    Microsoft.Maps.loadModule("Microsoft.Maps.SpatialMath", function () {
        //Request the user's location
        navigator.geolocation.getCurrentPosition(function (position) {
            var loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
            userLat = position.coords.latitude
            userLong = position.coords.longitude
            updatedLat = userLat + 0.05
            updatedLong = userLong + 0.05
            geocode()
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

    //Move to square nearby
    for (let x = 0; x < 10; x++){
        const longlat = [userLat, userLong, updatedLat, updatedLong]
        var geocodeRequest = "http://dev.virtualearth.net/REST/v1/LocalSearch/?query=" + encodeURIComponent(query) + "&userMapView=" + encodeURIComponent(longlat) + "&maxResults=25&jsonp=GeocodeCallback&key=" + BingMapsKey;
        CallRestService(geocodeRequest, GeocodeCallback);
        userLat += 0.05
        userLong += 0.05
        updatedLat += 0.05
        updatedLong += 0.05
    }
}

function GeocodeCallback(response) {
    var output = document.getElementById('output');
    let used = []
    
    function HasDuplicate(object){
        for (let i = 0; i < used.length; i++){
            if(used[i] == object)
            {
                return true
            }
        }
        return false
    }

    if (response &&
        response.resourceSets &&
        response.resourceSets.length > 0 &&
        response.resourceSets[0].resources) {

        var results = response.resourceSets[0].resources;

        let html = ['<table>'];
        
        for (var i = 0; i < results.length; i++) {
            if(results[i].PhoneNumber ==  "(770) 263-8808"){
                alert("Phone " + results[i].PhoneNumber + "Name " + results[i].name)
            }
            console.log("Phone " + results[i].PhoneNumber + "Name " + results[i].name)
            if (!HasDuplicate(results[i].PhoneNumber)){
                if(results[i].PhoneNumber ==  "(770) 263-8808"){
                    alert("Not Duplicated ; Adding ")
                }
                console.log("Not Duplicate")
                html.push('<tr><td>' + results[i].name + '</td><td>' + results[i].PhoneNumber + '</td></tr>');//<td>', results[i].Website, '</td>
                data += results[i].PhoneNumber + " , " + results[i].name + "\n"//Save Data into file
                used.push(results[i].PhoneNumber)
            } else {
                if(results[i].PhoneNumber ==  "(770) 263-8808"){
                    alert("Duplicate " + results[i].name)
                }
                console.log("Duplicate " + results[i].name)
            }
        }

        html.push('</table>');


        output.innerHTML += html.join('');


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
