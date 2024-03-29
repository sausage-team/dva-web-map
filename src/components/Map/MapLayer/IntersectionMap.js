require('@supermap/iclient-mapboxgl');
import { iserverBasePath } from '../../../services/config'
import mapboxgl from 'mapbox-gl'
class IntersectionMap {
    constructor(map) {
        this.map = map;
        this.data = null;
        this.addMapLay = this.addMapLay.bind(this);
        this.removeMapLay = this.removeMapLay.bind(this);
        this.filterBy = this.filterBy.bind(this);
        this.dataUrl = iserverBasePath;
    }
    MapLayData() {

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
                "id": "IntersectionMap",
                "type": "circle",
                "source": {
                    "type": "geojson",
                    "data": features
                },
                "paint": {
                    "circle-color": {
                        'type': 'identity',
                        'property': 'color'
                    }, /* 填充的颜色 */
                    "circle-opacity": 0.8,      /* 透明度 */
                    'circle-radius': 7
                },
            });
            this.map.addLayer({
                "id": "addIntersectionMap",
                "type": "circle",
                "source": {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": []
                    }
                },
                "paint": {
                    "circle-color": 'rgb(0, 255, 255)', /* 填充的颜色 */
                    "circle-opacity": 1,      /* 透明度 */
                    'circle-radius': 10
                },
            });
            this.filterBy(0);
        });
    }
    filterBy(time) {
        let filters = ["all", [">=", "time", time - 730], ["<=", "time", time]];
        if (this.map.getLayer("IntersectionMap")) {
            this.map.setFilter('IntersectionMap', filters);
        }
        // this.map.setFilter('count', filters);
    }
    removeMapLay() {
        if (this.map.getLayer("IntersectionMap")) {
            this.map.removeLayer("IntersectionMap");
            this.map.removeSource("IntersectionMap");
        }
        if (this.map.getLayer("addIntersectionMap")) {
            this.map.removeLayer("addIntersectionMap");
            this.map.removeSource("addIntersectionMap");
        }
    }
}
export default IntersectionMap;
