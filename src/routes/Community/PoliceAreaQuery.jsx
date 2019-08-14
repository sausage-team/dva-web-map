//辖区查询
import React from 'react';
import { connect } from 'dva';
import styles from './PoliceAreaQuery.css';
import MapBoxMap from '../../components/Range/MapboxRangePcsMap';
import QueryPoliceAreaSelect from '../../components/Range/QueryPoliceAreaSelect';
import PoliceAreaDataInfo from '../../components/Range/PoliceAreaDataInfo';
import ThreeRangeMap from '../../components/Range/ThreeRangeMap';
import {ThreeDefaultHeight} from '../../services/config';
class PoliceAreaQuery extends React.Component {
  constructor(props) {
    super(props);
  }

  //高亮对象到地图
  twoHightToMap = (selGeometry) => {
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
        'fill-color': '#ff0000',
        'fill-opacity': 0.3,
        'fill-outline-color': '#ff0000',
      }
    });
    // let lng = parseFloat(selGeometry.properties['GEOX'])
    let lng = parseFloat(selGeometry.properties['SMSDRIW'])
    // let lat = parseFloat(selGeometry.properties['GEOY'])
    let lat = parseFloat(selGeometry.properties['SMSDRIS'])
    map.flyTo({ center: [lng, lat], zoom: 11, speed: 0.2})
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
        material: Cesium.Color.RED.withAlpha(0.2),
        outline: true,
        outlineColor: Cesium.Color.RED,
        extrudedHeight:ThreeDefaultHeight
      }
    });
    viewer.zoomTo(viewer.entities);
  }
  //将地图风格控制显示成白天
  componentDidUpdate() {
    this.props.dispatch({
      type: 'mapPublic/setStyleValue',
      payload: ['白天']
    })
  }
  //销毁
  componentWillUnmount() {
    this.props.dispatch({
      type: 'policeArea/updateStateData',
      payload: {
        selGeometry: ''
      }
    })
  }
  render() {
    let { uiView, mapType } = this.props.policeArea;
    return (
      <div className={styles.mainBox}>
        {mapType == 1 ? <MapBoxMap twoHightToMap={this.twoHightToMap} /> : <ThreeRangeMap threeHightToMap={this.threeHightToMap} />}
        <div className={styles.selArea}>
          <QueryPoliceAreaSelect twoHightToMap={this.twoHightToMap} threeHightToMap={this.threeHightToMap} />
        </div>
        {uiView.sqFootModelView ? <PoliceAreaDataInfo /> : ''}
      </div>
    );
  }
}
function usersFun({ policeArea, map, cesium }) {
  return { policeArea, map, cesium };
}
// export default Lists;
export default connect(usersFun)(PoliceAreaQuery);
