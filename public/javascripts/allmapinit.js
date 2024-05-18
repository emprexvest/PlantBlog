let allMap;

function initializeAllMap() {
    const apiKey = 'AIzaSyCan1B_SwsXeN1BkGxXcKvq86KFrOTVlcI';

    const mapOptions = {
        center: {lat: 0, lng: 0 },
        zoom: 8
    };

    allMap = new google.maps.Map(document.getElementById('all-articles-map'), mapOptions);

    const articleLocations = [
        <% article.forEach(article => { %>
            <% if (article.coordinates) { %>
                { lat: <%= article.coordinates[1] %>, lng: <%= article.coordinates[0] %> },
           <% } %>
       <% }) %>
    ];

    articleLocations.forEach(location => {
        new google.maps.Marker({
            position: location,
            map: allMap,
        });
    })

}

google.maps.event.addDomListener(window, 'load', initializeAllMap);
