import mapboxgl from 'mapbox-gl';

class MapService {
    private readonly mapToken: string;

    constructor(mapToken: string) {
        this.mapToken = mapToken;
        mapboxgl.accessToken = mapToken;
    }

    createMap(home: string) {
        const campGrd = JSON.parse(home);
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/light-v10', // style URL
            center: campGrd.geometry.coordinates, // starting position [lng, lat]
            zoom: 9, // starting zoom
        });

        map.addControl(new mapboxgl.NavigationControl());

        new mapboxgl.Marker()
            .setLngLat(campGrd.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`<h3>${campGrd.title}</h3><p>${campGrd.location}</p>`)
            )
            .addTo(map);
    }
}

// Example usage:
const mapToken = process.env.MAPBOX_TOKEN as string;
const mapService = new MapService(mapToken);
const homeData = '{"title": "Campground Title", "location": "Campground Location", "geometry": {"coordinates": [lng, lat]}}';
mapService.createMap(homeData);
