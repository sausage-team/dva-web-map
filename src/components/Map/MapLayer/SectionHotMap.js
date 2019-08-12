import mapv, { DataSet } from 'mapv';
require('@supermap/iclient-mapboxgl');
import mapboxgl from 'mapbox-gl';
// import mapV from 'mapv';
import { iserverBasePath } from '../../../services/config'
class SectionHotMap {
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
            datasetNames: ['data:路网分析_道路'],
            fromIndex: 0,
            toIndex: 10000,
            maxFeatures: 10000
        });
        let service = new mapboxgl.supermap.FeatureService(this.dataUrl);
        service.getFeaturesByIDs(idsParam, (serviceResult) => {
          console.log('serviceResult',serviceResult)
            let features = {
                "type": "FeatureCollection",
                "features": []
            }
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
                            let obj = {
                                'properties': { time: data[j][z].time },
                                // 'count': parseInt(data[j][z].num) * 10 * Math.random() || 10 * Math.random(),
                                'count': parseInt(data[j][z].num),
                                // 'count': 30 * Math.random(),
                                'geometry': {
                                    'type': "LineString",
                                    //数据
                                    'coordinates': serviceResult.result.features.features[i].geometry.coordinates
                                }
                            }
                            features.features.push(obj);
        
                            this.data = features.features
                        }
                    }
                }
            }
            console.log('features.features',features.features)
            let color = ["#038E3E", "#24FF00", "#FFFF00", "#FF7800", "#FF0000", "#76043C"]
            var options = {
                max: 300,
                // strokeStyle: 'rgba(255, 255, 255, 1)',
                lineWidth: 5,
                shadowColor: 'rgba(255, 255, 255, 1)',
                shadowBlur: 20,
                draw: 'intensity',
                // size: 5,
                gradient: {
                  '0': 'blue',
                  '0.1': 'cyan',
                  '0.3': 'lime',
                  '0.5': 'yellow',
                  '1': 'red'
                },
                // max: 20,
                // maxSize: 400,
                // minSize: 1,
                // strength:0.8,
                // globalCompositeOperation: 'lighter',
                // shadowColor: 'rgba(250, 255, 0, 1)',
                // shadowBlur: 40,
            }
            let mapvData = []
            for (const key in this.data) {
                if (this.data[key].properties.time == 0) {
                    mapvData.push(this.data[key])
                }
            }
            let dataSet = new DataSet(mapvData);
            let mapVLayer = new mapboxgl.supermap.MapvLayer(this.map, dataSet, options);
            this.mapVLayer = mapVLayer;
            // this.filterBy(0);
        });
    }
    filterBy(time) {
        console.log(1)
        if (!time || time % 730 <= 24) {
            var mapvData = []
            for (const key in this.data) {
                if (this.data[key].properties.time >= time - 730 && this.data[key].properties.time <= time) {
                    mapvData.push(this.data[key])
                }
            }
            var options = {

                lineWidth: 5,
                max: 300,
                shadowColor: 'rgba(255, 255, 255, 1)',
                shadowBlur: 20,
                draw: 'intensity',
                // size: 5,
                gradient: {
                  '0': 'blue',
                  '0.1': 'cyan',
                  '0.3': 'lime',
                  '0.5': 'yellow',
                  '1': 'red'
              },
                // max: 20,
                // maxSize: 400,
                // minSize: 1,
                //strokeStyle: "rgba(255, 50, 50, 0.3)",
                // strength:0.8,
                // globalCompositeOperation: 'lighter',
                // shadowColor: 'rgba(250, 255, 0, 1)',
                // shadowBlur: 40
            }
            let dataSet = new DataSet(mapvData);
            this.mapVLayer && this.mapVLayer.update({ data: dataSet, options: options })
        }
    }
    removeMapLay() {
        if (this.mapVLayer) {
            this.mapVLayer.clearData()
            let DOM = this.map.getCanvasContainer();
            DOM = DOM.firstChild;
            if (DOM.nextSibling) {
                DOM = DOM.nextSibling;
                let DOMF = DOM.parentNode;
                DOMF.removeChild(DOM);
            }
        }
    }
}
export default SectionHotMap;
