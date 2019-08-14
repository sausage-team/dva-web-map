import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import mapboxgl from 'mapbox-gl';
window.mapboxgl = mapboxgl;
import 'mapbox-gl-compare';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import { ThreeServerApi,iserverBasePath} from '../../services/config'

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.map = '';
    this.beforeMap = '';
    this.afterMap = '';
  }
  componentDidMount() {
    //this.props.map.mapObj.setStyle(this.props.map.style2);
    this.beforeMap = new mapboxgl.Map({
      container: 'before',
      style: this.props.map.style1,
      zoom: 10,
      center: [115.84668255531719,39.975709767146529],
      maxZoom: 18,
      minZoom: 10
    });
    this.removeMissingdivCss()
    let mapStyle = {
      "version": 8,
      "sources": {
        "raster-tiles": {
          "type": "raster",
          "tiles": [`${ThreeServerApi}map-ugcv5-MTGWGS84BZ/rest/maps/MTGWGS84BZ/zxyTileImage.png?prjCoordSys={"epsgCode":3857}&z={z}&x={x}&y={y}`],
          "tileSize": 256,
        }
      },
      "layers": [{
        "id": "simple-tiles",
        "type": "raster",
        "source": "raster-tiles",
        maxZoom: 18,
        minZoom: 10
      }]
    }
    this.afterMap = new mapboxgl.Map({
      container: 'after',
      style: mapStyle,
      zoom: 10,
      center: [115.84668255531719,39.975709767146529],
      maxZoom: 18,
      minZoom: 10
    });
    this.removeMissingdivCss();
    this.map = new mapboxgl.Compare(this.beforeMap, this.afterMap, {
      //mousemove: true
    });
    this.beforeMap.on('load', () => {
      //this.removeMissingdivCss();
      this.beforeMap.setLayoutProperty('网格面@data_outline_0', 'visibility', 'none');
      this.beforeMap.setLayoutProperty('网格面@data#1', 'visibility', 'none');
      this.beforeMap.resize();
    })
    this.afterMap.on('load', () => {
      // this.removeMissingdivCss();
      let sqlParam1 = new SuperMap.GetFeaturesBySQLParameters({
        queryParameter: {
          name: "派出所辖区"
        },
        datasetNames: ['data:派出所辖区']
      });
      let service1 = new mapboxgl.supermap.FeatureService(iserverBasePath);
      service1.getFeaturesBySQL(sqlParam1, (serviceResult) => {
        this.afterMap.addLayer({
          "id": "pcsxq",
          "type": "line",
          "source": {
            "type": "geojson",
            "data": serviceResult.result.features
          },
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          "paint": {
            "line-color": "red", /* 填充的颜色 */
            "line-width": 6,
            'line-blur': 2,
            "line-opacity": 0.8      /* 透明度 */
          },
        });
      })
      this.afterMap.resize();
      this.afterMap.flyTo({
        center: [114.3038583200, 30.6479700100],
        zoom: 11,
        speed: 0.2
      })
    })
  }
  componentDidUpdate() {
    setTimeout(() => {
      if (this.map) {
        this.afterMap.resize();
        this.beforeMap.resize();
      }
    }, 185)
  }
  removeMissingdivCss = () => {
    const missingdiv = document.querySelector(".mapboxgl-missing-css");
    if (missingdiv) if (missingdiv) {
      let obj = missingdiv.parentNode;
      obj.removeChild(missingdiv)
    }
    const mapDOM = document.querySelector(".mapboxgl-ctrl-logo");
    if (mapDOM) {
      let obj = mapDOM.parentNode;
      obj.removeChild(mapDOM)
    }
    const draw = document.querySelector(".mapboxgl-ctrl");
    if (draw) {
      let obj = draw.parentNode;
      obj.removeChild(draw)
    }
  }
  render() {
    return (
      <div className={styles.mainIndex}>
        {/* <Mapbox /> */}
        <div id='before' className={styles.map}></div>
        <div id='after' className={styles.map}></div>
      </div>
    );
  }
}
function indexPage(indexPage) {
  return indexPage;
}
export default connect(indexPage)(IndexPage);
