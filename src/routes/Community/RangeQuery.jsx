//社区查询
import React from 'react';
import { connect } from 'dva';
import styles from './RangeQuery.css';
import MapBoxMap from '../../components/Range/MapboxRangeMap';
import QueryAreaSelect from '../../components/Range/QueryAreaSelect';
import SheQuDataInfo from '../../components/Range/SheQuDataInfo';
import GeWangDataInfo from '../../components/Range/GeWangDataInfo';
import SheQuJingliRight from '../../components/Range/SheQuJingliRight'
import CunGeJingliRight from '../../components/Range/CunGeJingliRight'
import ThreeRangeMap from '../../components/Range/ThreeRangeMap';
import Iframe from 'react-iframe';
import {bdpConfig,ThreeDefaultHeight} from '../../services/config';
class RangeQuery extends React.Component {
  constructor(props) {
    super(props);
  }
  //高亮对象到地图
  twoHightToMap = (selGeometry, sellevel) => {
    let map = this.props.map.mapObj;
    let selGeometryObj = map.getSource('selGeometry');
    if (selGeometryObj != null) {
      map.removeLayer('selGeometry')
      map.removeSource('selGeometry')
    }
    map.addLayer({
      'id': 'selGeometry',
      'type': 'fill',
      'source': {
        'type': 'geojson',
        'data': selGeometry
      },
      'layout': {
      },
      'paint': {
        'fill-color': '#438bf9',
        'fill-opacity': 0.3,
        'fill-outline-color': '#438bf9',
      }
    });
    // let lng = parseFloat(selGeometry.properties['GEOX'])
    let lng = parseFloat(selGeometry.properties['SMSDRIW'])
    // let lat = parseFloat(selGeometry.properties['GEOY'])
    let lat = parseFloat(selGeometry.properties['SMSDRIS'])
    map.flyTo({ center: [lng, lat], zoom: sellevel == 1 ? 10 : 16, speed: 0.2 })
  }
  //二维高亮到地图 带高度显示
  twoHightToMapHasHeight = (selGeometry) => {
    let map = this.props.map.mapObj;
    let selGeometryObj = map.getSource('selGeometry');
    if (selGeometryObj != null) {
      map.removeLayer('selGeometry')
      map.removeSource('selGeometry')
    }
    map.addLayer({
      'id': 'selGeometry',
      'type': 'fill-extrusion',
      'source': {
        'type': 'geojson',
        'data': selGeometry
      },
      'layout': {
      },
      'paint': {
        'fill-extrusion-color': '#ff0000',
        'fill-extrusion-opacity': 0.6,
        'fill-extrusion-height': 300,
        'fill-extrusion-base': 50,
      }
    });
    // let lng = parseFloat(selGeometry.properties['GEOX'])
    let lng = parseFloat(selGeometry.properties['SMSDRIW'])
    // let lat = parseFloat(selGeometry.properties['GEOY'])
    let lat = parseFloat(selGeometry.properties['SMSDRIS'])
    map.flyTo({ center: [lng, lat], zoom: 14, speed: 0.2, bearing: 0, pitch: 60 })
  }
  //三维地图数据高亮显示
  threeHightToMap = (selGeometry) => {
    let lnglat = selGeometry.geometry.coordinates;
    let points = [];
    for (let m = 0; m < lnglat.length; m++) {
      let fistItem = lnglat[m];
      for (let i = 0; i < fistItem.length; i++) {
        let point = fistItem[i];
        for (let j = 0; j < point.length; j++) {
          let kItem = point[j];
          if (kItem.length > 0) {
            for (let n = 0; n < kItem.length; n++) {
              points.push(kItem[n]);
            }
          } else {
            points.push(kItem);
          }
        }
      }
    }
    let viewer = this.props.cesium.cesiumObj;
    viewer.entities.removeAll();
    viewer.scene.primitives.removeAll();
    viewer.entities.add({
      name: 'geometry' + selGeometry.id,
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray(points),
        material: Cesium.Color.RED.withAlpha(0.3),
        outline: true,
        outlineColor: Cesium.Color.RED,
        extrudedHeight:ThreeDefaultHeight
      }
    });
    viewer.zoomTo(viewer.entities);
  }

  //将地图风格重置成白色
  componentDidMount() {
    this.props.dispatch({
      type: 'mapPublic/setStyleValue',
      payload: ['白天']
    })
  }

  //销毁
  componentWillUnmount() {
    this.props.dispatch({
      type: 'range/updateStateData',
      payload: {
        selGeometry: ''
      }
    })
  }
  render() {
    let { sqFootModelView, sqRightModelView, cgFootModelView, cgRightModelView } = this.props.range.uiView;
    let mapType = this.props.range.mapType;
    return (
      <div className={styles.mainBox}>
      <Iframe id="J_bridge" url={bdpConfig} display="none"></Iframe>
        {mapType == 1 ? <MapBoxMap twoHightToMap={this.twoHightToMap} twoHightToMapHasHeight={this.twoHightToMapHasHeight} /> : <ThreeRangeMap threeHightToMap={this.threeHightToMap} />}
        <div className={styles.selArea}>
          <QueryAreaSelect twoHightToMap={this.twoHightToMap} threeHightToMap={this.threeHightToMap} twoHightToMapHasHeight={this.twoHightToMapHasHeight} />
        </div>
        {sqFootModelView ? <SheQuDataInfo /> : ''}
        {sqRightModelView ? <SheQuJingliRight /> : ''}
        {cgFootModelView ? <GeWangDataInfo /> : ''}
        {cgRightModelView ? <CunGeJingliRight /> : ''}
      </div>
    );
  }
}
function usersFun({ range, map, cesium }) {
  return { range, map, cesium };
}
// export default Lists;
export default connect(usersFun)(RangeQuery);
