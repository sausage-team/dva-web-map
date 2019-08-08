require('@supermap/iclient-mapboxgl');
import { iserverBasePath } from '../../../services/config'
import mapboxgl from 'mapbox-gl'
class PavementMap {
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
        for (let i = 1; i <= 64; i++) {
            IDs.push(i)
        }
        let idsParam = new SuperMap.GetFeaturesByIDsParameters({
            IDs: IDs,
            datasetNames: ['data:路网分析面'],
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
            let color = ["#038E3E", "#24FF00", "#FFFF00", "#FF7800", "#FF0000", "#76043C"]
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
                                'properties': { ...serviceResult.result.features.features[i].properties, ...{ num: data[j][z].num, time: data[j][z].time, color: color[o], geometry: serviceResult.result.features.features[i].geometry } },
                                'geometry': {
                                    'type': "MultiPolygon",
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
                "id": "PavementMap",
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
                    "fill-opacity": 0.4      /* 透明度 */
                },
            });
            this.map.addLayer({
                id: "PavementMapCount",
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
                    "text-color": "#fff"
                }
            })
            this.map.addLayer({
                "id": "addPavementMap",
                "type": "fill",
                "source": {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": []
                    }
                },
                "paint": {
                    "fill-color": 'rgb(0, 255, 255)', /* 填充的颜色 */
                    "fill-opacity": 1      /* 透明度 */
                },
            })
            this.filterBy(0);
        });
    }
    filterBy(time) {
        let filters = ["all", [">=", "time", time - 730], ["<=", "time", time]]
        if (this.map.getLayer("PavementMap")) {
            this.map.setFilter('PavementMap', filters);
        }
        if (this.map.getLayer("PavementMapCount")) {
            this.map.setFilter('PavementMapCount', filters);
        }
    }
    removeMapLay() {
        if (this.map.getLayer("PavementMap")) {
            this.map.removeLayer("PavementMap");
            this.map.removeSource("PavementMap");
        }
        if (this.map.getLayer("addPavementMap")) {
            this.map.removeLayer("addPavementMap");
            this.map.removeSource("addPavementMap");
        }
        if (this.map.getLayer("PavementMapCount")) {
            this.map.removeLayer("PavementMapCount");
            this.map.removeSource("PavementMapCount");
        }
    }
}
export default PavementMap;
