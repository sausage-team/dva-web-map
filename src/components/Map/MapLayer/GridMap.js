class GridMap {
    constructor(map) {
        this.map = map;
        this.data = null;
        this.addMapLay = this.addMapLay.bind(this);
        this.removeMapLay = this.removeMapLay.bind(this);
        this.filterBy = this.filterBy.bind(this)
    }
    MapLayData(data) {
        this.data = data;
        const color = ["#038E3E", "#24FF00", "#FFFF00", "#FF7800", "#FF0000", "#76043C"]
        let obj = {
            "type": "FeatureCollection",
            "features": []
        }
        // var endarr = [];
        for (var key in data) {
            let hours = parseInt(key - 1) % 100 * 730;
            for (var j in data[key]) {
                let features = {
                    'type': 'Feature',
                    'properties': {
                        'color': color[data[key][j].level],
                        time: hours,
                        num: data[key][j].num || ''
                    },
                    'geometry': {
                        'type': 'Polygon',
                        //数据
                        'coordinates': this.toLonLat(data[key][j].wgx, data[key][j].wgy)
                    }
                }
                obj.features.push(features)
            }
        }
        return obj;
    }
    toLonLat(x, y) {
        var arr = [];
        var arrend = [];
        var zoom = 16;
        let lon = parseFloat(x);
        let lat = parseFloat(y)
        var lon_min = lon / Math.pow(2, zoom) * 360 - 180;
        var lon_max = (lon + 1) / Math.pow(2, zoom) * 360 - 180;
        var lat_min = Math.atan(Math.sinh(Math.PI * (1 - ((lat - 1) / Math.pow(2, zoom - 1))))) * 180 / Math.PI - 0.005;
        var lat_max = Math.atan(Math.sinh(Math.PI * (1 - (lat / Math.pow(2, zoom - 1))))) * 180 / Math.PI - 0.005;
        arr.push([lon_min, lat_min])
        arr.push([lon_min, lat_max])
        arr.push([lon_max, lat_max])
        arr.push([lon_max, lat_min])
        arr.push([lon_min, lat_min])
        arrend.push(arr)
        return arrend
    }
    addMapLay(data) {
        let mapData = this.MapLayData(data)
        let option = {
            'id': 'honeycomb',
            'type': 'fill',
            'source': {
                "type": "geojson",
                "data": mapData
            },
            'layout': {},
            'paint': {
                'fill-color': {
                    'type': 'identity',
                    'property': 'color'
                },
                'fill-opacity': 0.6
            }
        }
        let option1 = ({
            id: "count",
            type: "symbol",
            source: {
                "type": "geojson",
                "data": mapData
            },
            filter: ["has", "point_count"],
            layout: {
                "text-field": "{num}",
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 12
            },
            paint: {
                "text-color": "#fff"
            }
        });
        if (!this.map.getLayer('honeycomb')) {
            this.map.addLayer(option);
            this.map.addLayer(option1);
        }
        this.filterBy(0);
    }
    removeMapLay() {
        if (this.map.getLayer('honeycomb')) {
            this.map.removeLayer('honeycomb');
            this.map.removeSource('honeycomb');
            this.map.removeLayer('count');
            this.map.removeSource('count');
        }
    }
    filterBy(time) {
        let filters = ["all", [">=", "time", time - 730], ["<=", "time", time]]
        if (this.map.getLayer('honeycomb')) {
            this.map.setFilter('honeycomb', filters);
        }
        if (this.map.getLayer('count')) {
            this.map.setFilter('count', filters);
        }
    }
}
export default GridMap;
