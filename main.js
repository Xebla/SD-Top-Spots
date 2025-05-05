console.log("main.js loaded");

let currentInfoWindow = new google.maps.InfoWindow(); // Reusable InfoWindow
// let userLocation;
let map;

function closeInfoWindow() {
    if (currentInfoWindow) {
        currentInfoWindow.close();
    }
}

$(document).ready(function() {
    console.log("DOM is ready!");
    // Default user location to center of San Diego if geolocation fails
    userLocation = { lat: 32.7157, lng: -117.1611 }; 
    // Display Top Spots 
    loadTopSpots();
});
 
    // Called by Google Maps once it loads
// function initMap() {
//     console.log("Google Maps is ready!");

//     // Opens up Google Map inside #map element centered on San Diego
//     map = new google.maps.Map(document.getElementById("map"), {
//         center: { lat: 32.7157, lng: -117.1611 }, 
//         zoom : 12
//     });

//     // Get user's current location
//     navigator.geolocation.getCurrentPosition(
//         function (position) {
//             userLocation = {
//                 lat: position.coords.latitude,
//                 lng: position.coords.longitude
//             };

//             // Show user's location on map
//             new google.maps.Marker({
//                 position: userLocation,
//                 map: map,
//                 title: "You are here"
//             });

//             // Load top Spots once user location is known
//             loadTopSpots();
//         },

//         // Load table even without user location
//         function (error) {
//             console.warn("Geolocation failed or was denied. Using default San Diego center.");
//             userLocation = { lat: 32.7157, lng: -117.1611 };
//             loadTopSpots(); 
//         }
//     );
// }

function loadTopSpots() {
    console.log("Loading top spots...");

    $.getJSON("data.json", function(topSpots) {
        console.log("Top spots loaded:", topSpots);
        // Loop through each item
        topSpots.forEach(spot => {
            let [lat, lng] = spot.location;

             // Convert meters to miles and calculate distance from user location and top spot
            let distanceMiles = userLocation
                ? (google.maps.geometry.spherical.computeDistanceBetween(
                    new google.maps.LatLng(userLocation.lat, userLocation.lng),
                    new google.maps.LatLng(lat, lng)
                ) / 1609.34).toFixed(2)
                : "N/A";
    
                // Adds a marker on the map for each spot
                if (map) {
                    console.log("Marker loaded...")
                    const marker = new google.maps.Marker({
                        position: { lat, lng },
                        map,
                        title: spot.name
                    });

                    // When marker is clicked, open top spot content
                    marker.addListener('click', () => {
                        currentInfoWindow.setContent(infoContent);
                        currentInfoWindow.open(map, marker);
                    });
                }
                        
                 // Build Table Row and link to Google Maps
                const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
                const directionsLink = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}`;
                    
                const row = `
                    <tr class="spot-row">
                        <td class="spot-name">${spot.name}</td>
                        <td>${spot.description}</td>
                        <td><a href="${mapLink}" target="_blank">Map</a></td>
                        <td><a href="${directionsLink}" target="_blank">Directions</a></td>
                        <td>${distanceMiles}</td>
                    </tr>
                `;
                $("#spots-table").append(row);
        });                     
    });
}

// function sortTableByDistance() {
//     const rows = $("#spots-table tr").get();

//     rows.sort((a, b) => {
//         const distA = parseFloat($(a).children("td").eq(4).text());
//         const distB = parseFloat($(b).children("td").eq(4).text());
//         return distA - distB;
//     });

//     rows.forEach(row => $("#spots-table").append(row));
// }

