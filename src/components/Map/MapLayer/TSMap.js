require('@supermap/iclient-mapboxgl');
import { iserverBasePath } from '../../../services/config'
import mapboxgl from 'mapbox-gl'
class TSMap {
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
            let color = ["#038E3E", "#24FF00", "#FFFF00", "#FF7800", "#FF0000", "#76043C"];
            let features = {
                "type": "FeatureCollection",
                "features": []
            }
            let features1 = {
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
                    // console.log( serviceResult.result.features.features[i], data[j].smid)
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
                        if(data[j].cameraTs){
                            x = data[j].cameraTs[0].smx;
                            y = data[j].cameraTs[0].smy;
                        }
                        let obj = {
                            'type': 'Feature',
                            'properties': { num: data[j].caseNum, color: color[o], SMX: x, SMY: y, ID: data[j].smid },
                            'geometry': {
                                'type': "MultiPolygon",
                                //数据
                                'coordinates': serviceResult.result.features.features[i].geometry.coordinates
                            }
                        }
                        let obj1 = {
                            'type': 'Feature',
                            'properties': { color: color[o] },
                            'geometry': {
                                'type': "Point",
                                //数据
                                'coordinates': [parseFloat(x), parseFloat(y)]
                            }
                        }
                        features1.features.push(obj1);
                        features.features.push(obj);
                    }
                }
            }
            // let features = serviceResult.result.features;
            this.map.addLayer({
                "id": "TSMap",
                "type": "fill",
                "source": {
                    "type": "geojson",
                    "data": features
                },
                "paint": {
                    "fill-color": {
                        'type': 'identity',
                        'property': 'color'
                    }, /* 填充的颜色 */
                    "fill-opacity": 0.2   /* 透明度 */
                },
            });
            this.map.addLayer({
                id: "TSMapCount",
                type: "symbol",
                source: {
                    "type": "geojson",
                    "data": features
                },
                layout: {
                    "text-field": "{num}",
                    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                    "text-size": 16
                },
                paint: {
                    "text-color": "#333"
                }
            })
            this.map.addLayer({
                "id": "TSMapPoint",
                "type": "circle",
                "source": {
                    type: "geojson",
                    data: features1
                },
                "paint": {
                    "circle-radius": 5,
                    //Color circle by earthquake magnitude
                    "circle-color": '#000',
                    // "circle-color": {
                    //     'type': 'identity',
                    //     'property': 'color'
                    // },
                    "circle-stroke-color": "white",
                    "circle-stroke-width": 1
                }
            })
            this.map.addLayer({
                'id': 'addTSMap',
                "source": {
                    type: "geojson",
                    data: {
                        "type": "FeatureCollection",
                        "features": []
                    }
                },
                'type': 'fill-extrusion',
                "paint": {
                    "fill-extrusion-color": 'rgb(0, 255, 255)',
                    "fill-extrusion-height": 300,
                    'fill-extrusion-opacity': 0.5
                }
            });
        });
    }
    filterBy(time) {
        let filters = ["all", [">=", "time", time - 730], ["<=", "time", time]]
        this.map.setFilter('IntersectionMap', filters);
        // this.map.setFilter('count', filters);
    }
    removeMapLay() {
        if (this.map.getLayer("TSMap")) {
            this.map.removeLayer("TSMap");
            this.map.removeSource("TSMap");
        }
        if (this.map.getLayer("TSMapCount")) {
            this.map.removeLayer("TSMapCount");
            this.map.removeSource("TSMapCount");
        }
        if (this.map.getLayer("TSMapPoint")) {
            this.map.removeLayer("TSMapPoint");
            this.map.removeSource("TSMapPoint");
        }
        if (this.map.getLayer("addTSMap")) {
            this.map.removeLayer("addTSMap");
            this.map.removeSource("addTSMap");
        }
    }
}
export default TSMap;
