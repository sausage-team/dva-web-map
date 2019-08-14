require('@supermap/iclient-mapboxgl');
import { iserverBasePath } from '../../../services/config'
import mapboxgl from 'mapbox-gl'
class CameraMap {
  constructor(map, data) {
    this.map = map;
    this.data = null;
    this.addMapLay = this.addMapLay.bind(this);
    this.removeMapLay = this.removeMapLay.bind(this);
    this.filterBy = this.filterBy.bind(this);
    this.dataUrl = iserverBasePath;
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
  addMapLay(data) {
    this.data = data;
    let IDs = [];
    for (let i = 1; i <= 143; i++) {
      IDs.push(i)
    }
    var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
      queryParameter: {
        name: "Camera",
        // attributeFilter: "POLICE_NUM in (" + policeNum.toString() + ")"
      },
      datasetNames: ['data:Camera'],
      fromIndex: 0,
      toIndex: 10000,
      maxFeatures:10000
    });
    let service = new mapboxgl.supermap.FeatureService(this.dataUrl);
    service.getFeaturesBySQL(sqlParam, (serviceResult) => {
      if(data){
        this.map.addLayer({
          "id": "CameraMap",
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
          "id": "CameraMapHeat",
          "type": "heatmap",
          "source": {
            type: "geojson",
            data: this.MapLayData(this.data),
          },
          "maxzoom": 16,
          "paint": {
            "heatmap-weight": {
              "property": "mag",
              "type": "exponential",
              "stops": [
                [0, 0],
                [6, 1]
              ]
            },
            "heatmap-intensity": 1,
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
                [4, 5],
                [9, 30]
              ]
            },
            "heatmap-opacity": {
              "default": 1,
              "stops": [
                [10, 0.9],
                [22, 0.4]
              ]
            },
          }
        }, 'CameraMap');
      }

      this.map.addLayer({
        "id": "CameraMapPoint",
        "type": "circle",
        "source": {
          type: "geojson",
          data: serviceResult.result.features
        },
        "paint": {
          "circle-radius": 4,
          "circle-color": 'orange',
          "circle-stroke-color": "#000",
          "circle-stroke-width": 1,
          'circle-opacity': 0.8
        }
      })
      this.map.addLayer({
        "id": "addCameraMapPoint",
        "type": "circle",
        "source": {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": []
          }
        },
        "paint": {
          "circle-radius": 6,
          "circle-color": 'rgb(0, 255, 255)',
        }
      })
      this.filterBy(0);
    });
  }
  filterBy(time) {
    let filters = ["all", [">=", "time", time - 730], ["<=", "time", time]]
    if (this.map.getLayer("CameraMapHeat")) {
      this.map.setFilter('CameraMapHeat', filters);
    }
  }
  removeMapLay() {
    if (this.map.getLayer("CameraMapPoint")) {
      this.map.removeLayer("CameraMapPoint");
      this.map.removeSource("CameraMapPoint");
    }
    if (this.map.getLayer("CameraMapHeat")) {
      this.map.removeLayer("CameraMapHeat");
      this.map.removeSource("CameraMapHeat");
    }
    if (this.map.getLayer("CameraMap")) {
      this.map.removeLayer("CameraMap");
      this.map.removeSource("CameraMap");
    }
    if (this.map.getLayer("addCameraMapPoint")) {
      this.map.removeLayer("addCameraMapPoint");
      this.map.removeSource("addCameraMapPoint");
    }
  }
}
export default CameraMap;
