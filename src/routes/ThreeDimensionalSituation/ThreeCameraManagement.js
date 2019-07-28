import React from 'react';
import { connect } from 'dva';
import { Radio } from 'antd';
import styles from './ThreeCameraManagement.css';
import CesiumMap from '../../components/Map/Cesium/Cesium';
import CesiumMapContriller from '../../components/Map/CesiumController/CesiumMap';
import ThreeCameraTab from '../../components/DataTab/ThreeCameraTab';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class ThreeCameraManagement extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={styles.mainIndex}>
        <CesiumMap />
        <div className={styles.contriller}>
            <CesiumMapContriller />
        </div>
        {this.props.threeCameraManagement.checkedKeys[0]?<div className={styles.threeCameraTab}>
            <ThreeCameraTab />
        </div>:''}
      </div>
    );
  }
}
function ThreeCameraManagementFun({cesium,threeCameraManagement}) {
  return {cesium,threeCameraManagement};
}
export default connect(ThreeCameraManagementFun)(ThreeCameraManagement);
