import turf from 'turf'
class HexGridMap {
    constructor(map) {
        this.map = map;
        this.data = null;
        this.addMapLay = this.addMapLay.bind(this);
        this.removeMapLay = this.removeMapLay.bind(this);
        this.filterBy = this.filterBy.bind(this)
    }
    MapLayData(data) {
        this.data = data;
        // const color = ["#038E3E", "#24FF00", "#FFFF00", "#FF7800", "#FF0000", "#76043C"]
        let obj = {
            "type": "FeatureCollection",
            "features": []
        }
        // var endarr = [];
        for (var key in data) {
            // let hours = parseInt(key - 1) % 100 * 730;
            // var cellSide = 0.02;
            // var options = { units: 'kilometers' };
            for (var j in data[key]) {
                let line = turf.lineString(this.toLonLat(data[key][j].wgx, data[key][j].wgy));
                let bbox = turf.bbox(line);
                let poly = turf.hexGrid(bbox, '0.03', 'degrees');
                //return poly;
                // let features = {
                //     'type': 'Feature',
                //     'properties': {
                //         'color': color[data[key][j].level],
                //         time :0,
                //         num:data[key][j].num||''
                //     },
                //     'geometry': {
                //         'type': 'Polygon',
                //         //数据
                //         'coordinates': [[[116.1385162914533,40.08647677488563],[116.13165505193092,40.09557004162745],[116.11793257288619,40.09557004162745],[116.11107133336381,40.08647677488563],[116.11793257288619,40.07738350814382],[116.13165505193092,40.07738350814382],[116.1385162914533,40.08647677488563]]]
                //     }
                // }
                obj.features.concat(poly.features);
            }
        }
        return obj;
    }
    toLonLat(x, y) {
        // var arr = [];
        var arrend = [];
        var zoom = 15;
        let lon = parseFloat(x);
        let lat = parseFloat(y)
        var lon_min = lon / Math.pow(2, zoom) * 360 - 180;
        var lon_max = (lon + 1) / Math.pow(2, zoom) * 360 - 180;
        var lat_min = Math.atan(Math.sinh(Math.PI * (1 - ((lat - 1) / Math.pow(2, zoom - 1))))) * 180 / Math.PI;
        var lat_max = Math.atan(Math.sinh(Math.PI * (1 - (lat / Math.pow(2, zoom - 1))))) * 180 / Math.PI;
        arrend.push([lon_min, lat_min])
        arrend.push([lon_min, lat_max])
        arrend.push([lon_max, lat_max])
        arrend.push([lon_max, lat_min])
        arrend.push([lon_min, lat_min])
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
        // this.filterBy(0);
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
        this.map.setFilter('honeycomb', filters);
        this.map.setFilter('count', filters);
    }
}
export default HexGridMap;
