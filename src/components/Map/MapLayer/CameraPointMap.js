require('@supermap/iclient-mapboxgl');
import { iserverBasePath } from '../../../services/config'
import mapboxgl from 'mapbox-gl'
class CameraPointMap {
  constructor(map, data) {
    this.map = map;
    this.data = null;
    this.addMapLay = this.addMapLay.bind(this);
    this.removeMapLay = this.removeMapLay.bind(this);
    this.dataUrl = iserverBasePath;
  }
  MapLayData(data) {
    let arr = [];
    const geojson = {
      "type": "FeatureCollection",
      "features": []
    };
    for (let i in data) {
      let feature = {
        'type': 'Feature',
        'id': data[i].smid,
        'properties': data[i],
        'geometry': {
          'type': 'Point',
          'coordinates': [data[i].smx, data[i].smy]
        }
      }
      arr.push(feature);
    }
    geojson.features = arr;
    return geojson;
  }
  addMapLay(data) {
    this.data = data;
      this.map.addLayer({
        "id": "CameraMapPoint",
        "type": "circle",
        "source": {
          type: "geojson",
          data: this.MapLayData(this.data)
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
export default CameraPointMap;
