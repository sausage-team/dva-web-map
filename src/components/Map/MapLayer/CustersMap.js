class CustersMap {
    constructor(map) {
        this.map = map;
        this.data = null;
        this.addMapLay = this.addMapLay.bind(this);
        this.removeMapLay = this.removeMapLay.bind(this);
        this.filterBy = this.filterBy.bind(this)
        this.instantiationDefaultRun();
    }
    MapLayData(data) {
        let arr = [];
        const geojson = {
            "type": "FeatureCollection",
            "features": []
        };
        for (let j in data) {
            let hours = parseInt(j) * 730;
            for (let i in data[j].list) {
                let minute = hours;
                let features = {
                    'type': 'Feature',
                    'properties': {
                        'time': minute,
                        'point_count':1,
                        'point_count_abbreviated':1
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
    /**
     * 默认初始化方法
     */
    instantiationDefaultRun() {

    }

    addMapLay(data) {
        this.data = data;
        // this.map.addSource("circlemap", {
        //     type: "geojson",
        //     data:this.MapLayData(this.data),
        //     cluster: true,
        //     clusterMaxZoom: 17,
        //     clusterRadius: 90
        // });
        this.map.addLayer({
            id: "clusters",
            type: "circle",
            source: {
                type: "geojson",
                data: this.MapLayData(this.data),
                cluster: true,
                clusterMaxZoom: 22,
                clusterRadius: 90
            },
            filter: ["has", "point_count"],
            paint: {
                "circle-color": [
                    "step",
                    ["get", "point_count"],
                    "#51bbd6",
                    100,
                    "#f1f075",
                    750,
                    "#f28cb1"
                ],
                "circle-radius": [
                    "step",
                    ["get", "point_count"],
                    20,
                    100,
                    30,
                    750,
                    40
                ]
            }
        });

        this.map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: {
                type: "geojson",
                data: this.MapLayData(this.data),
                cluster: true,
                clusterMaxZoom: 22,
                clusterRadius: 90
            },
            filter: ["has", "point_count"],
            layout: {
                "text-field": "{point_count_abbreviated}",
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 12
            }
        });

        this.map.addLayer({
            id: "unclustered-point",
            type: {
                type: "geojson",
                data: this.MapLayData(this.data),
                cluster: true,
                clusterMaxZoom: 22,
                clusterRadius: 90
            },
            source: "circlemap",
            filter: ["!has", "point_count"],
            paint: {
                "circle-color": "#11b4da",
                "circle-radius": 4,
                "circle-stroke-width": 1,
                "circle-stroke-color": "#fff"
            }
        });
    }
    filterBy(time) {
        let filters = ["all", [">=", "time", time - 730], ["<=", "time", time]];
        if (this.map.getLayer("clusters")) {
            this.map.setFilter("clusters", filters);
        }
        if (this.map.getLayer("cluster-count")) {
            this.map.setFilter("cluster-count", filters);
        }
        if (this.map.getLayer("unclustered-point")) {
            this.map.setFilter("unclustered-point", filters);
        }
    }
    removeMapLay() {
        if (this.map.getLayer("clusters")) {
            this.map.removeLayer("clusters");
            this.map.removeSource("clusters");
        }
        if (this.map.getLayer("cluster-count")) {
            this.map.removeLayer("cluster-count");
            this.map.removeSource("cluster-count");
        }
        if (this.map.getLayer("unclustered-point")) {
            this.map.removeLayer("unclustered-point");
            this.map.removeSource("unclustered-point");
        }
    }

}

export default CustersMap;
