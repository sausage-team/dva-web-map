import React from 'react';
import { connect } from 'dva';
// import { Radio } from 'antd';
import styles from './PersonnelTrajectory.css';
import CesiumMap from '../../components/Map/Cesium/Cesium';
import CesiumPersonne from '../../components/Map/CesiumController/CesiumPersonne';
import CesiumSlider from '../../components/Slider/CesiumSlider';
// const RadioButton = Radio.Button;
// const RadioGroup = Radio.Group;
class PersonnelTrajectory extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={styles.mainIndex}>
        <CesiumMap />
        <div className={styles.leftTop}>
          <CesiumPersonne />
        </div>
        {this.props.personnelTrajectory.witchData ? <div className={styles.slider}>
          <CesiumSlider />
        </div> : ""}
      </div>
    );
  }
}
function PersonnelTrajectoryFun({ cesium, personnelTrajectory }) {
  return { cesium, personnelTrajectory };
}
export default connect(PersonnelTrajectoryFun)(PersonnelTrajectory);
