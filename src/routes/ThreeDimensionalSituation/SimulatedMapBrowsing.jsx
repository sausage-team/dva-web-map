import React from 'react';
import { connect } from 'dva';
import { Radio } from 'antd';
import styles from './SimulatedMapBrowsing.css';
import CesiumMap from '../../components/Map/Cesium/Cesium';
import CesiumController from '../../components/Map/CesiumController/CesiumController';
import CesiumPublic from '../../components/Map/CesiumController/CesiumPublic'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class SimulatedMapBrowsing extends React.Component {
  constructor(props) {
    super(props)
  }
  changeFun = (e) => {
    let flyManager = this.props.simulatedMapBrowsing.flyManager;
    console.log(this.props.simulatedMapBrowsing.radioValue)
    if (e.target.value == 1) {
      if (flyManager) {
        flyManager && flyManager.pause();
      }
      this.props.dispatch({
        type: 'simulatedMapBrowsing/setRadioValue',
        payload: true
      })
    } else {
      this.props.dispatch({
        type: 'simulatedMapBrowsing/setRadioValue',
        payload: false
      })
    }
  }
  render() {
    return (
      <div className={styles.mainIndex}>
        <CesiumMap />
        <div className={styles.Radio}>
          <RadioGroup defaultValue="1" size="large" onChange={this.changeFun}>
            <RadioButton value="1">态势展现</RadioButton>
            <RadioButton value="2">飞行路径</RadioButton>
          </RadioGroup>
        </div>
        {this.props.simulatedMapBrowsing.radioValue ? '' : <div className={styles.CesiumController}><CesiumController /></div>}
        <div className={styles.rightTop}>
          <CesiumPublic />
        </div>
      </div>
    );
  }
}
function SimulatedMapBrowsingFun({ cesium, simulatedMapBrowsing }) {
  return { cesium, simulatedMapBrowsing };
}
export default connect(SimulatedMapBrowsingFun)(SimulatedMapBrowsing);
