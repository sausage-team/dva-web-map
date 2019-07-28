require('@supermap/iclient-mapboxgl');
import { iserverBasePath } from '../../../services/config'
import mapboxgl from 'mapbox-gl'
class TSHotMap {
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
        for (let i = 1; i <= data.length; i++) {
            IDs.push(i)
        }
        let idsParam = new SuperMap.GetFeaturesByIDsParameters({
            IDs: IDs,
            datasetNames: ['data:Camera_voronoi'],
            fromIndex: 0,
            toIndex: 10000
        });
        let service = new mapboxgl.supermap.FeatureService(this.dataUrl);
        service.getFeaturesByIDs(idsParam, (serviceResult) => {
            console.log(serviceResult);
            let color = ["#038E3E", "#24FF00", "#FFFF00", "#FF7800", "#FF0000", "#76043C"];
            let features = {
                "type": "FeatureCollection",
                "features": []
            }
            let num = [];
            for (let i in data) {
                num.push(data[i].caseNum);
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
                num = num / 6;
                num = [[s, s + num], [s + num + 1, s + num * 2], [s + num * 2 + 1, s + num * 3], [s + num * 3 + 1, s + num * 4], [s + num * 4 + 1, s + num * 5], [s + num * 5 + 1, s + num * 6]];
            } else {
                let length = num.length;
                length = length / 4;
                num = [[num[0], num[parseInt(length)]], [num[parseInt(length)] + 1, num[parseInt(2 * length)]], [num[parseInt(2 * length)] + 1, num[parseInt(3 * length)]], [num[parseInt(3 * length)] + 1, num[parseInt(4 * length)]], [num[parseInt(4 * length)] + 1, num[parseInt(5 * length)]], [num[parseInt(5 * length)] + 1, num[parseInt(6 * length)]]]
            }
            for (let j in data) {
                for (let i in serviceResult.result.features.features) {
                    if (serviceResult.result.features.features[i].id == data[j].smid) {
                        let o = 0;
                        if (data[j].caseNum <= num[0][1]) {
                            o = 0;
                        } else if (data[j].caseNum <= num[1][1]) {
                            o = 1;
                        } else if (data[j].caseNum <= num[2][1]) {
                            o = 2;
                        } else if (data[j].caseNum <= num[3][1]) {
                            o = 3;
                        } else if (data[j].caseNum <= num[4][1]) {
                            o = 4;
                        } else {
                            o = 5;
                        }
                        let x = 0;
                        let y = 0;
                        if (data[j].cameraTs) {
                            x = data[j].cameraTs[0].smx;
                            y = data[j].cameraTs[0].smy;
                        }
                        let obj = {
                            'type': 'Feature',
                            'properties': { num: data[j].caseNum, color: color[o], SMX: x, SMY: y, ID: data[j].smid },
                            'geometry': {
                                'type': "Point",
                                //数据
                                'coordinates': [parseFloat(x), parseFloat(y)]
                            }
                        }
                        features.features.push(obj);
                    }
                }
            }
            // this.map.addLayer({
            //     "id": "TSHotMapPointlabel",
            //     "type": "symbol",
            //     "source": {
            //         type: "geojson",
            //         data: features
            //     },
            //     "minzoom": 18,
            //     "filter": ["in", "class", "canal", "river"],
            //     "layout": {
            //         "text-field": "{name_en}",
            //         "text-font": ["DIN Offc Pro Italic", "Arial Unicode MS Regular"],
            //         "symbol-placement": "line",
            //         "text-pitch-alignment": "viewport",
            //         "text-max-angle": 30,
            //         "text-size": {
            //             "base": 1,
            //             "stops": [[13, 12], [18, 16]]
            //         }
            //     },
            //     "paint": {
            //         "text-halo-width": 0,
            //         "text-halo-blur": 0,
            //         "text-color": "#78888a"
            //     }
            // });
            this.map.addLayer({
                "id": "TSHotMap",
                "type": "heatmap",
                "source": {
                    type: "geojson",
                    data: features
                },
                "paint": {
                    //Increase the heatmap weight based on frequency and property magnitude
                    "heatmap-weight": {
                        "property": "index",
                        "type": "exponential",
                        "stops": [
                            [0, 0.1],
                            [5, 0.5]
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
                        "property": "num",
                        "type": "exponential",
                        "stops": [
                            [0, 7],
                            [15, 35]
                        ]
                    },
                    "heatmap-opacity": {
                        "default": 1,
                        "stops": [
                            [7, 0.9],
                            [15, 0.6]
                        ]
                    },
                }
            });
            this.map.addLayer({
                "id": "TSHotMapPoint",
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
            });
            this.map.addLayer({
                "id": "addTSHotMapPoint",
                "type": "circle",
                "source": {
                    type: "geojson",
                    data: {
                        "type": "FeatureCollection",
                        "features": []
                    }
                },
                "paint": {
                    "circle-radius": 4,
                    //Color circle by earthquake magnitude
                    "circle-color": 'rgb(0, 255, 255)',
                    "circle-stroke-color": "white",
                    "circle-stroke-width": 1,
                    "circle-opacity": 1
                }
            });
        });
    }
    filterBy(time) {
        // let filters = ["all", [">=", "time", time - 365], ["<=", "time", time + 365]]
        // this.map.setFilter('IntersectionMap', filters);
        // this.map.setFilter('count', filters);
    }
    removeMapLay() {
        if (this.map.getLayer("TSHotMapPoint")) {
            this.map.removeLayer("TSHotMapPoint");
            this.map.removeSource("TSHotMapPoint");
        }
        if (this.map.getLayer("TSHotMapPointlabel")) {
            this.map.removeLayer("TSHotMapPointlabel");
            this.map.removeSource("TSHotMapPointlabel");
        }
        if (this.map.getLayer("TSHotMap")) {
            this.map.removeLayer("TSHotMap");
            this.map.removeSource("TSHotMap");
        }
        if (this.map.getLayer("addTSHotMapPoint")) {
            this.map.removeLayer("addTSHotMapPoint");
            this.map.removeSource("addTSHotMapPoint");
        }
    }
}
export default TSHotMap;
