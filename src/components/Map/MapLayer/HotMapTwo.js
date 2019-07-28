
/**
 * 动态人口地图热力图显示
 */
class HotMapTwo {
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
      let features = {
        'type': 'Feature',
        'properties': {
          'num': data[j].n,
        },
        'geometry': {
          'type': 'Point',
          //数据
          'coordinates': [data[j].x, data[j].y, data[j].n]
        }
      }
      arr.push(features);
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
      "maxzoom": 18,
      "paint": {
        //Increase the heatmap weight based on frequency and property magnitude
        "heatmap-weight": {
          "property": "num",
          "type": "exponential",
          "stops": [
            [0, 0],
            [50, 1]
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
            [1, 7],
            [50, 40]
          ]
        },
        "heatmap-opacity": {
          "default": 1,
          "stops": [
            [10, 0.9],
            [18, 0.7]
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
      "minzoom": 17,
      "paint": {
        "circle-radius": 4,
        //Color circle by earthquake magnitude
        "circle-color": {
          "property": "num",
          "type": "exponential",
          "stops": [
            [0, color[0]],
            [10, color[1]],
            [20, color[2]],
            [30, color[3]],
            [40, color[4]],
            [50, color[5]]
          ]
        },
        "circle-stroke-color": "white",
        "circle-stroke-width": 1,
        "circle-opacity": {
          "stops": [
            [16, 0],
            [18, 1]
          ]
        }
      }
    }, 'waterway-label');
    // this.filterBy(0);
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

export default HotMapTwo;
