class CaseMap {
    constructor(map) {
        this.map = map;
        this.data = null;
        this.addMapLay = this.addMapLay.bind(this);
        this.removeMapLay = this.removeMapLay.bind(this);
        this.filterBy = this.filterBy.bind(this)
    }
    MapLayData(data) {
        let color = {
            '入室盗窃案': '#ff3939',
            '盗窃电力设备': '#ff742f',
            '拦路抢劫案': '#ffdb15',
            '盗窃牲畜案': '#62ed3c',
            '信用卡诈骗案': '#7377c5',
            '盗窃电动自行车案': '#7933db',
            '盗窃摩托车案': '#bd8bfb',
            '抢劫案': '#5c9cfe',
            '盗窃自行车案': '#86dce1',
            '诈骗案': '#c0f03d',
            '盗窃汽车案': '#e8691c',
            '盗窃案': '#f68686',
            '扒窃案': '#f93b5e',
            '盗窃保险柜案': '#e0407c',
            '抢夺案': '#f8d46d',
        }
        let color1 = {
            '0006': '#27c9b4',
            '0612': '#27c951',
            '1218': '#ffca14',
            '1824': '#ff4d4d',
            'nottime': '#62ed3c',
        }
        let color2 = {
            '0006': '#7d20dc',
            '0612': '#7d20dc',
            '1218': '#33b9db',
            '1824': '#33b9db',
            'nottime': '#62ed3c',
        }

        let arr = [];
        const geojson = {
            "type": "FeatureCollection",
            "features": []
        };
        for (let j in data) {
            let hours = parseInt(j) * 730;
            for (let i in data[j].list) {
                let obj = data[j].list[i][3];
                let obj1 = data[j].list[i][4];
                let minute = hours;
                let features = {
                    'type': 'Feature',
                    'properties': {
                        'color': color[obj] || '#000',
                        'color1': color1[obj1] || '#000',
                        'color2': color2[obj1] || '#000',
                        'time': minute,
                    },
                    'geometry': {
                        'type': 'Point',
                        //数据
                        'coordinates': [data[j].list[i][0], data[j].list[i][1], 1]
                    }
                }
                arr.push(features);
            }
        }
        geojson.features = arr;
        return geojson;
    }
    addMapLay(data, value) {
        if (value == 1) {
            this.map.addLayer({
                "id": "CaseMapPoint",
                "type": "circle",
                "source": {
                    type: "geojson",
                    data: this.MapLayData(data)
                },
                "paint": {
                    "circle-radius": 7,
                    "circle-color": {
                        "type": "identity",
                        "property": "color",
                    },
                    "circle-opacity": 1
                }
            });
        } else if (value == 2) {
            this.map.addLayer({
                "id": "CaseMapPoint",
                "type": "circle",
                "source": {
                    type: "geojson",
                    data: this.MapLayData(data)
                },
                "paint": {
                    "circle-radius": 7,
                    "circle-color": {
                        "type": "identity",
                        "property": "color1",
                    },
                    "circle-opacity": 1
                }
            });
        } else {
            this.map.addLayer({
                "id": "CaseMapPoint",
                "type": "circle",
                "source": {
                    type: "geojson",
                    data: this.MapLayData(data)
                },
                "paint": {
                    "circle-radius": 7,
                    "circle-color": {
                        "type": "identity",
                        "property": "color2",
                    },
                    "circle-opacity": 1
                }
            });
        }
        this.filterBy(0)
    }
    filterBy(time) {
        let filters = ["all", [">=", "time", time - 730], ["<=", "time", time]];
        if (this.map.getLayer("CaseMapPoint")) {
            this.map.setFilter('CaseMapPoint', filters);
        }
    }
    removeMapLay() {
        if (this.map.getLayer("CaseMapPoint")) {
            this.map.removeLayer("CaseMapPoint");
            this.map.removeSource("CaseMapPoint");
        }
    }
}
export default CaseMap;