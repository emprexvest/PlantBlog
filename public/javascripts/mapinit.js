let map;
let marker;

function initializeMap() {
    const mapOptions = {
        center: { lat: 0, lng: 0 },
        zoom: 8
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
    const markerOptions = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: { lat: 0, lng: 0 }
    });

    const marker = new google.maps.Marker(markerOptions);

    google.maps.event.addListener(marker, 'dragend', function (event) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        document.getElementById('locationLat').value = lat;
        document.getElementById('locationLng').value = lng;
    });

    // Get the users current location and update the input fields
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            document.getElementById('locationLat').value = userLat;
            document.getElementById('locationLng').value = userLng;

            const userLocation = new google.maps.LatLng(userLat, userLng);
            map.setCenter(userLocation);
            marker.setPosition(userLocation);
        });
    }
}