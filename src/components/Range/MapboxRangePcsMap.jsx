import React from 'react';
import styles from './MapboxRangeMap.css';
import { connect } from 'dva';
import { fangKong } from '../../services/config'
import Mapbox from '../../components/Map/Mapbox/Mapbox';
import MapPublic from '../../components/Map/MapController/MapPublic';
class MapboxRangePcsMap extends React.Component {
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
        if (zoom > 10.9 && zoom < 15) {
          features = map.queryRenderedFeatures(e.point, { layers: [layerConfig.pcs.id] });
          levle = 2;
        }
        if (features != null && features.length > 0) {
          let id = features[0].id;
          if (levle == 2) {
            this.props.policeArea.handlePcsChange(id)
          } else if (levle == 1) {
            this.props.policeArea.handleCqSqChange(id)
          }
        }
      });
      // 三维切换到二维 定位
      let selGeometry = this.props.policeArea.selGeometry;
      if (selGeometry != '' && selGeometry.id != '') {
        this.props.twoHightToMap(selGeometry);
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
function mapFun({ map, policeArea }) {
  return { map, policeArea };
}
export default connect(mapFun)(MapboxRangePcsMap);
