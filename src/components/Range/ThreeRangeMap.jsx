import React from 'react';
import styles from './MapboxRangeMap.css';
import { connect } from 'dva';
import CesiumMap from '../../components/Map/Cesium/Cesium';
class ThreeRangeMap extends React.Component {
  constructor(props) {
    super(props);
  }
  //初次渲染
  componentDidMount() {
    // 二维切换到三维 定位
    let selGeometry=this.props.policeArea.selGeometry;
    if(selGeometry!='' && selGeometry.id!=''){
        this.props.threeHightToMap(selGeometry);
     }
    let selGeometry2=this.props.range.selGeometry;
    if(selGeometry2!='' && selGeometry2.id!=''){
        this.props.threeHightToMap(selGeometry2);
     }
  }
    //销毁
componentWillUnmount(){
  }
  render() {
    return (
      <div className={styles.mapbox}>
      <CesiumMap />
      </div>
    )
  }
}
function mapFun({policeArea,range}) {
  return {policeArea,range};
}
export default connect(mapFun)(ThreeRangeMap);
