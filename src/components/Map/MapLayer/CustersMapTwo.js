class CustersMapTwo {
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
            if (data[j].n > 0) {
                let features = {
                    'type': 'Feature',
                    'properties': {
                        'point_count': parseInt(data[j].n),
                        'point_count_abbreviated': parseInt(data[j].n)
                    },
                    'geometry': {
                        'type': 'Point',
                        //数据
                        'coordinates': [data[j].x, data[j].y, data[j].n]
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
        let color = ["#038E3E", "#24FF00", "#FFFF00", "#FF7800", "#FF0000", "#76043C"];
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
            filter: ["all", [">", "point_count", 0]],
            paint: {
                "circle-color": [
                    "step",
                    ["get", "point_count"],
                    color[1],
                    100,
                    color[2],
                    750,
                    color[3],
                    1500,
                    color[4],
                    2100,
                    color[5]
                ],
                "circle-radius": [
                    "step",
                    ["get", "point_count"],
                    10,
                    100,
                    18,
                    750,
                    26,
                    1500,
                    34,
                    2100,
                    42
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
            filter: ["all", [">", "point_count", 0]],
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

export default CustersMapTwo;
