var map, searchManager;
var BingMapsKey = 'AuV6Kc6hF3yFNL_DXFTDGuSu9DCdIK8zYF208z0eNdqbXtt87UHslIKJ70900Wbj';
let data = ""//String to store data that will be saved 
let userLat , userLong, updatedLat, updatedLong
let used = []//Array for posted numbers


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
    document.getElementById('output').innerHTML = "" // Clear out old input before posting new search result
    //Move around the map and get locations from specific square
    for (let x = 0; x < 10; x++){
        const longlat = [userLat, userLong, updatedLat, updatedLong]
        var geocodeRequest = "http://dev.virtualearth.net/REST/v1/LocalSearch/?query=" + encodeURIComponent(query) + "&userMapView=" + encodeURIComponent(longlat) + "&maxResults=25&jsonp=GeocodeCallback&key=" + BingMapsKey;
        CallRestService(geocodeRequest, GeocodeCallback);
        userLat += 0.05
        userLong += 0.05
        updatedLat += 0.05
        updatedLong += 0.05
    }
    console.log(used)
}

function GeocodeCallback(response) {
    let output = document.getElementById('output');
    //Chech if phone number has been already posted
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
            console.log("Phone " + results[i].PhoneNumber + " Name " + results[i].name)
            if (!HasDuplicate(results[i].PhoneNumber)){
                console.log("Not Duplicate")
                html.push('<tr><td>' + results[i].name + '</td><td>' + results[i].PhoneNumber + '</td></tr>');//<td>', results[i].Website, '</td>
                data += results[i].PhoneNumber + " , " + results[i].name + "\n"//Save Data into file
                used.push(results[i].PhoneNumber)
            } else {
                console.log("IsDuplicate " + results[i].name)
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
