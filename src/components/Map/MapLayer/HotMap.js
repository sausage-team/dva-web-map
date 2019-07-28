
/**
 * 动态人口地图热力图显示
 */
class HotMap {
  constructor(map, data, dispatch) {
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
        let minute = hours + data[j].list[i][2];
        let features = {
          'type': 'Feature',
          'properties': {
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
  /**
   * 默认初始化方法
   */
  instantiationDefaultRun() {

  }

  addMapLay(data) {
    this.data = data;
    this.map.addLayer({
      "id": "waterway-label",
      "type": "symbol",
      "source": {
        type: "geojson",
        data: this.MapLayData(this.data),
      },
      "minzoom": 12,
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
        data: this.MapLayData(this.data),
      },
      "maxzoom": 17,
      "paint": {
        //Increase the heatmap weight based on frequency and property magnitude
        "heatmap-weight": {
          "property": "mag",
          "type": "exponential",
          "stops": [
            [10, 0],
            [17, 1]
          ]
        },
        "heatmap-intensity": {
          "stops": [
            [0, 1],
            [17, 0]
          ]
        },
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, "rgba(33,102,172,0)",
          0.2, "rgb(103,169,207)",
          0.4, "rgb(209,229,240)",
          0.6, "rgb(253,219,199)",
          0.8, "rgb(239,138,98)",
          1, "rgb(178,24,43)"
        ],
        "heatmap-radius": {
          "stops": [
            [1, 5],
            [5, 30]
          ]
        },
        "heatmap-opacity": {
          "default": 1,
          "stops": [
            [7, 0.8],
            [17, 0.5]
          ]
        },
      }
    }, 'waterway-label');


    this.map.addLayer({
      "id": "point",
      "type": "circle",
      "source": {
        type: "geojson",
        data: this.MapLayData(this.data),
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
          "property": "mag",
          "type": "exponential",
          "stops": [
            [1, "rgba(33,102,172,0)"],
            [3, "rgb(103,169,207)"],
            [5, "rgb(209,229,240)"],
            [7, "rgb(253,219,199)"],
            [9, "rgb(239,138,98)"],
            [10, "rgb(178,24,43)"]
          ]
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
  }
  filterBy(time) {
    let filters = ["all", [">=", "time", time - 360], ["<=", "time", time + 360]];
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
    };
    if (this.map.getLayer("heat")) {
      this.map.removeLayer("heat");
      this.map.removeSource("heat");
    };
    if (this.map.getLayer("waterway-label")) {
      this.map.removeLayer("waterway-label");
      this.map.removeSource("waterway-label");
    };
  }

}

export default HotMap;
