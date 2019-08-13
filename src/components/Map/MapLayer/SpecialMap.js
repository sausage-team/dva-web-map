require('@supermap/iclient-mapboxgl');
import mapboxgl from 'mapbox-gl';
import { iserverBasePath } from '../../../services/config'
class SpecialMap {
    constructor(map, data) {
        this.map = map;
        this.data = null;
        this.addMapLay = this.addMapLay.bind(this);
        this.removeMapLay = this.removeMapLay.bind(this);
        this.dataUrl = iserverBasePath;
    }
    MapLayData(data) {

    }
    addMapLay(data, value) {
        let num = [];
        let policeNum = [];
        for (let i in data) {
            num.push(data[i].num);
            policeNum.push("'" + data[i].policeNum + "'")
        }
        let num1 = num;
        for (let i in num) {
            for (let j in num1) {
                if (num1[j] > num[i]) {
                    let a = num[i];
                    num[i] = num1[j];
                    num1[j] = a;
                }
            }
        }
        if (value == 1) {
            let s = num[0];
            num = num[num.length - 1] - num[0];
            num = num / 4;
            num = [[s, s + num], [s + num + 1, s + num * 2], [s + num * 2 + 1, s + num * 3], [s + num * 3 + 1, s + num * 4]];
        } else {
            num = [[num[0], num[2]], [num[2] + 1, num[6]], [num[6] + 1, num[9]], [num[9] + 1, num[13]]]
        }
        var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
            queryParameter: {
                name: "派出所辖区",
                // attributeFilter: "POLICE_NUM in (" + policeNum.toString() + ")"
            },
            datasetNames: ['data:派出所辖区']
        });
        let service = new mapboxgl.supermap.FeatureService(this.dataUrl);
        service.getFeaturesBySQL(sqlParam, (serviceResult) => {
            let features = [];
            let color = ["#038E3E", "#24FF00", "#FFFF00", "#FF7800", "#FF0000", "#76043C"]
            // console.log(data,serviceResult.result.features.features)
            for (let i in serviceResult.result.features.features) {
                let o = 0;
                for (let j in data) {
                    if (serviceResult.result.features.features[i].properties.ZZJG.trim() == data[j].policeNum.trim()) {
                      console.log('data[j]',data[j])
                        if (data[j].num <= num[0][1]) {
                            o = 1;
                        } else if (data[j].num <= num[1][1]) {
                            o = 2;
                        } else if (data[j].num <= num[2][1]) {
                            o = 3;
                        } else {
                            o = 4;
                        }
                        serviceResult.result.features.features[i].properties = {
                            ...serviceResult.result.features.features[i].properties,
                            ...{
                              num: data[j].num,
                              name: data[j].name
                            }
                        }
                    }
                }
                serviceResult.result.features.features[i].properties = {
                    ...serviceResult.result.features.features[i].properties,
                    ...{ color: color[o] }
                }
            }
            console.log('serviceResult.result.features',serviceResult.result.features)
            this.map.addLayer({
                "id": "SpecialMap",
                "type": "fill",
                "source": {
                    "type": "geojson",
                    "data": serviceResult.result.features
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
                id: "count",
                type: "symbol",
                source: {
                    "type": "geojson",
                    "data": serviceResult.result.features
                },
                layout: {
                    "text-field": "{name}（{num}）",
                    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                    "text-size": 16
                },
                paint: {
                    "text-color": "#000"
                }
            })
        });
    }
    removeMapLay() {
        if (this.map.getLayer("SpecialMap")) {
            this.map.removeLayer("SpecialMap");
            this.map.removeSource("SpecialMap");
        }
        if (this.map.getLayer("count")) {
            this.map.removeLayer("count");
            this.map.removeSource("count");
        }
    }
}
export default SpecialMap;
