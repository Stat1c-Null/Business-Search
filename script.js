var map, searchManager;
var BingMapsKey = 'AuV6Kc6hF3yFNL_DXFTDGuSu9DCdIK8zYF208z0eNdqbXtt87UHslIKJ70900Wbj';

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

