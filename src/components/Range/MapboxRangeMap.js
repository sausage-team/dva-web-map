import React from 'react';
import styles from './MapboxRangeMap.css';
import { connect } from 'dva';
import { fangKong } from '../../services/config'
import Mapbox from '../../components/Map/Mapbox/Mapbox';
import MapPublic from '../../components/Map/MapController/MapPublic'
class MapboxRangeMap extends React.Component {
  constructor(props) {
    super(props);
  }
  //初次渲染
  componentDidMount() {
    let map = this.props.map.mapObj;
    let layerConfig = fangKong.layer;
    map.on('load', () => {
      //  山区
      map.addLayer({
        'id': layerConfig.cqsq.id,
        'type': 'fill',
        'source': {
          'type': 'geojson',
          'data': layerConfig.cqsq.url
        },
        'layout': {
        },
        'paint': {
          'fill-color': '#03fb61',
          'fill-opacity': 0,
          'fill-outline-color': '#0f0',
        }
      });
      //社区边界面
      map.addLayer({
        'id': layerConfig.sq.id,
        'type': 'fill',
        'source': {
          'type': 'geojson',
          'data': layerConfig.sq.url
        },
        'layout': {

        },
        'paint': {
          'fill-color': '#03fb61',
          'fill-opacity': 0,//0.4
          'fill-outline-color': '#0f0',
        }
      });
      //派出所边界面
      map.addLayer({
        'id': layerConfig.pcs.id,
        'type': 'fill',
        'source': {
          'type': 'geojson',
          'data': layerConfig.pcs.url
        },
        'layout': {

        },
        'paint': {
          'fill-color': '#03fb61',
          'fill-opacity': 0,//0.4
          'fill-outline-color': '#0f0',
        }
      });
      let levle = 0;
      map.on('click', (e) => {
        let features = null;
        let zoom = map.getZoom();
        if (zoom < 10.1) {
          features = map.queryRenderedFeatures(e.point, { layers: [layerConfig.cqsq.id] });//
          levle = 1;
        } else {
          features = map.queryRenderedFeatures(e.point, { layers: [layerConfig.sq.id] });
          levle = 2;
        }
        if (features != null && features.length > 0) {
          let id = features[0].id;
          if (levle == 2) {
            this.props.range.handleSheQuChange(id)
          } else {
            this.props.range.handleCqSqChange(id)
          }
        }
      });
      // 三维切换到二维 定位
      let selGeometry = this.props.range.selGeometry;
      if (selGeometry != '' && selGeometry.id != '') {
        let level = this.props.range.level;
        if (level == 2) {
          this.props.twoHightToMapHasHeight(selGeometry);
        } else {
          this.props.twoHightToMap(selGeometry, level);
        }
      } else {
        map.flyTo({ center: [114.60955588089992,30.589574087170054], zoom: 13, speed: 0.2 })
      }
    })
  }
  //销毁
  componentWillUnmount() {
  }
  render() {
    return (
      <div className={styles.mapbox}>
        <Mapbox />
        <div className={styles.rightTop}>
          <MapPublic />
        </div>
      </div>
    )
  }
}
function mapFun({ map, policeArea, range }) {
  return { map, policeArea, range };
}
export default connect(mapFun)(MapboxRangeMap);
