//这个图的对象保存暂时和IntersectionMap用同一套  等后期定了 决定要不要区分出来
require('@supermap/iclient-mapboxgl');
import { iserverBasePath } from '../../../services/config'
import mapboxgl from 'mapbox-gl'
class IntersectionHotMap {
    constructor(map, data) {
        this.map = map;
        this.data = null;
        this.addMapLay = this.addMapLay.bind(this);
        this.removeMapLay = this.removeMapLay.bind(this);
        this.filterBy = this.filterBy.bind(this);
        this.dataUrl = iserverBasePath;
    }
    MapLayData(data) {

    }
    addMapLay(data, value) {

        let IDs = [];
        for (let i = 1; i <= data[0].length; i++) {
            IDs.push(i)
        }
        let idsParam = new SuperMap.GetFeaturesByIDsParameters({
            IDs: IDs,
            datasetNames: ['data:路网分析_路口'],
            fromIndex: 0,
            toIndex: 10000,
            maxFeatures: 10000
        });
        let service = new mapboxgl.supermap.FeatureService(this.dataUrl);
        service.getFeaturesByIDs(idsParam, (serviceResult) => {
            let features = {
                "type": "FeatureCollection",
                "features": []
            }
            // let color = ["#038E3E", "#24FF00", "#FFFF00", "#FF7800", "#FF0000", "#76043C"]
            let color = ["rgba(255,255,255,0)", "#24FF00", "#FFFF00", "#FF7800", "#FF0000", "#76043C"]
            for (let j in data) {
                let x = j * 730;
                let num = [];
                for (let i in data[j]) {
                    data[j][i].time = x;
                    num.push(data[j][i].num);
                }
                let num1 = num;
                for (let i in num) {
                    for (let c in num1) {
                        if (num1[c] > num[i]) {
                            let a = num[i];
                            num[i] = num1[c];
                            num1[c] = a;
                        }
                    }
                }
                if (value == 1) {
                    let s = num[0];
                    num = num[num.length - 1] - num[0];
                    num = num / 4;
                    num = [[s, s + num], [s + num + 1, s + num * 2], [s + num * 2 + 1, s + num * 3], [s + num * 3 + 1, s + num * 4]];
                } else {
                    let length = num.length;
                    length = length / 4;
                    num = [[num[0], num[parseInt(length)]], [num[parseInt(length)] + 1, num[parseInt(2 * length)]], [num[parseInt(2 * length)] + 1, num[parseInt(3 * length)]], [num[parseInt(3 * length)] + 1, num[parseInt(4 * length)]]]
                }
                for (let z in data[j]) {
                    for (let i in serviceResult.result.features.features) {
                        if (serviceResult.result.features.features[i].properties.SMID == data[j][z].smid) {
                            let o = 0;
                            if (data[j][z].num <= num[0][1]) {
                                o = 1;
                            } else if (data[j][z].num <= num[1][1]) {
                                o = 2;
                            } else if (data[j][z].num <= num[2][1]) {
                                o = 3;
                            } else {
                                o = 4;
                            }
                            let obj = {
                                'type': 'Feature',
                                'properties': { num: data[j][z].num, time: data[j][z].time, color: color[o] },
                                'geometry': {
                                    'type': "Point",
                                    //数据
                                    'coordinates': serviceResult.result.features.features[i].geometry.coordinates
                                }
                            }
                            features.features.push(obj);
                        }
                    }
                }
            }
            this.map.addLayer({
                "id": "waterway-label",
                "type": "symbol",
                "source": {
                    type: "geojson",
                    data: features
                },
                "minzoom": 18,
                "filter": ["in", "class", "canal", "river"],
                "layout": {
                    "text-field": "{name_en}",
                    "text-font": ["DIN Offc Pro Italic", "Arial Unicode MS Regular"],
                    "symbol-placement": "line",
                    "text-pitch-alignment": "viewport",
                    "text-max-angle": 30,
                    "text-size": {
                        "base": 1,
                        "stops": [[13, 12], [18, 16]]
                    }
                },
                "paint": {
                    "text-halo-width": 0,
                    "text-halo-blur": 0,
                    "text-color": "#78888a"
                }
            });
            this.map.addLayer({
                "id": "heat",
                "type": "heatmap",
                "source": {
                    type: "geojson",
                    data: features
                },
                "maxzoom": 15,
                "paint": {
                    //Increase the heatmap weight based on frequency and property magnitude
                    "heatmap-weight": {
                        "property": "num",
                        "type": "exponential",
                        "stops": [
                            [0, 0],
                            [8, 1]
                        ]
                    },
                    "heatmap-intensity": {
                        "stops": [
                            [0, 1],
                            [18, 0]
                        ]
                    },
                    "heatmap-color": [
                        "interpolate",
                        ["linear"],
                        ["heatmap-density"],
                        0, color[0],
                        0.2, color[1],
                        0.4, color[2],
                        0.6, color[3],
                        0.8, color[4],
                        1, color[5]
                    ],
                    "heatmap-radius": {
                        "stops": [
                            [4, 5],
                            [9, 30]
                        ]
                    },
                    "heatmap-opacity": {
                        "default": 1,
                        "stops": [
                            [7, 0.9],
                            [15, 0.4]
                        ]
                    },
                }
            }, 'waterway-label');
            this.map.addLayer({
                "id": "point",
                "type": "circle",
                "source": {
                    type: "geojson",
                    data: features
                },
                "minzoom": 14,
                "paint": {
                    "circle-radius": {
                        "property": "mag",
                        "type": "exponential",
                        "stops": [
                            [{ zoom: 14, value: 1 }, 1],
                            [{ zoom: 14, value: 5 }, 5],
                            [{ zoom: 18, value: 1 }, 5],
                            [{ zoom: 18, value: 5 }, 50],
                        ]
                    },
                    //Color circle by earthquake magnitude
                    "circle-color": {
                        'type': 'identity',
                        'property': 'color'
                    },
                    "circle-stroke-color": "white",
                    "circle-stroke-width": 1,
                    "circle-opacity": {
                        "stops": [
                            [8, 0],
                            [15, 1]
                        ]
                    }
                }
            }, 'waterway-label');
            this.filterBy(0);
        });
    }
    filterBy(time) {
        let filters = ["all", [">=", "time", time - 730], ["<=", "time", time]];
        if (this.map.getLayer("heat")) {
            this.map.setFilter('heat', filters);
        }
        if (this.map.getLayer("point")) {
            this.map.setFilter('point', filters);
        }
    }
    removeMapLay() {
        if (this.map.getLayer("point")) {
            this.map.removeLayer("point");
            this.map.removeSource("point");
        }
        if (this.map.getLayer("heat")) {
            this.map.removeLayer("heat");
            this.map.removeSource("heat");
        }
        if (this.map.getLayer("waterway-label")) {
            this.map.removeLayer("waterway-label");
            this.map.removeSource("waterway-label");
        }
    }
}
export default IntersectionHotMap;
