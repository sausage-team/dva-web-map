import React from 'react';
import { connect } from 'dva';
import { Radio } from 'antd';
import styles from './TrajectoryBrowsing.css';
import CesiumMap from '../../components/Map/Cesium/Cesium';
import CesiumTrajectory from '../../components/Map/CesiumController/CesiumTrajectory';
import TrajectoryTab from '../../components/DataTab/TrajectoryTab';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class TrajectoryBrowsing extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={styles.mainIndex}>
        <CesiumMap />
        <div className={styles.contriller}>
            <CesiumTrajectory />
        </div>
        {this.props.trajectoryBrowsing.checkedKeys[0]?<div className={styles.threeCameraTab}>
            <TrajectoryTab />
        </div>:''}
      </div>
    );
  }
}
function TrajectoryBrowsingFun({cesium,trajectoryBrowsing}) {
  return {cesium,trajectoryBrowsing};
}
export default connect(TrajectoryBrowsingFun)(TrajectoryBrowsing);
