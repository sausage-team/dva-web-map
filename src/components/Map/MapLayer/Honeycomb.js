
/**
 * 动态人口地图热力图显示
 */
import mapv, { DataSet } from 'mapv';
require('@supermap/iclient-mapboxgl');
import mapboxgl from 'mapbox-gl';
class Honeycomb {
  constructor(map, data, dispatch) {
    this.map = map;
    this.data = null;
    this.mapVLayer = '';
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
          // 'type': 'Feature',
          // 'properties': {
          //   'time': minute,
          // },
          count: 1,
          'geometry': {
            'type': 'Point',
            //数据
            'coordinates': [data[j].list[i][0], data[j].list[i][1]]
          }
        }
        arr.push(features);
      }
    }
    geojson.features = arr;
    return arr;
  }
  /**
   * 默认初始化方法
   */
  instantiationDefaultRun() {

  }

  addMapLay(data) {
    var options = {
      fillStyle: 'rgba(55, 50, 250, 0.8)',
      shadowColor: 'rgba(255, 250, 50, 1)',
      shadowBlur: 20,
      label: {
        show: true,
        fillStyle: 'white',
        // shadowColor: 'yellow',
        // font: '20px Arial',
        // shadowBlur: 10,
      },
      size: 45,
      globalAlpha: 0.7,
      gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" },
      draw: 'honeycomb'
    };
    let mapvData = this.MapLayData(data);
    let dataSet = new DataSet(mapvData);
    let mapVLayer = new mapboxgl.supermap.MapvLayer(this.map, dataSet, options);
    this.mapVLayer = mapVLayer;
  }
  filterBy(time) {
    let filters = ["all", [">=", "time", time - 730], ["<=", "time", time]]
    this.map.setFilter('heat', filters);
    this.map.setFilter('point', filters);
  }
  removeMapLay() {
    if (this.mapVLayer) {
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

export default Honeycomb;
