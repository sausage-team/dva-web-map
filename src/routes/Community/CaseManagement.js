import React from 'react';
import { connect } from 'dva';
import { Radio } from 'antd';
import styles from './CaseManagement.css';
import Mapbox from '../../components/Map/Mapbox/Mapbox';
import Slider from '../../components/Slider/Slider';
import img1 from '../../../public/img/mapeg.png';
import img2 from '../../../public/img/mapeg2.png';
import img3 from '../../../public/img/mapeg3.png';
import MapPublic from '../../components/Map/MapController/MapPublic'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class CaseManagement extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.map.mapObj.setStyle(this.props.map.style1);
    this.props.dispatch({
      type: 'mapPublic/setStyleValue',
      payload: ['白天']
    })
  }
  changeFun = (e) => {
    let mapObj = this.props.map.mapObj;
    if (e.target.value == 1) {
      this.props.dispatch({
        type: 'map/getCaseMap',
        payload: {
          mapObj: mapObj,
          value: 1
        }
      })
    } else {
      this.props.dispatch({
        type: 'map/getCaseMap',
        payload: {
          mapObj: mapObj,
          value: 2
        }
      })
    }
    this.props.dispatch({
      type: 'caseManagment/setSliderValue',
      payload: e.target.value
    })
    this.props.dispatch({
      type: 'caseManagment/setSliderShow',
      payload: true
    })
  }
  callback = (e) => {
    let mapObj = this.props.map.mapObj;
    this.props.dispatch({
      type: 'map/getCaseMap',
      payload: {
        mapObj: mapObj,
        value: e.target.value
      }
    })
    this.props.dispatch({
      type: 'caseManagment/setSliderValue',
      payload: e.target.value
    })
  }
  render() {
    return (
      <div className={styles.mainIndex}>
        <div className={styles.tab} >
          <RadioGroup size="large" onChange={this.changeFun}>
            <RadioButton value="1">高发案件类型</RadioButton>
            <RadioButton value="2">高发案件时段</RadioButton>
          </RadioGroup>
        </div>
        <Mapbox />
        {this.props.map.timeShowState ? <div>
          {this.props.caseManagment.sliderShow ? <div className={styles.slider}>
            <Slider />
          </div> : ""}
        </div> : ""}
        {this.props.caseManagment.sliderShow ? <div className={styles.mapeg}>
          {this.props.caseManagment.sliderValue == 1 ? <img src={img1} /> : <div className={styles.mapeg1}>
            <span className={styles.span}>时间段选择</span><br />
            <RadioGroup defaultValue={this.props.caseManagment.sliderValue} size="large" onChange={this.callback} size="small">
              <RadioButton value="2">四时段</RadioButton>
              <RadioButton value="3">二时段</RadioButton>
            </RadioGroup>
            {this.props.caseManagment.sliderValue == 2 ? <img src={img2} /> : <img src={img3} />}
          </div>
          }
        </div> : ""}
        <div className={styles.rightTop}>
          <MapPublic />
        </div>
      </div>
    );
  }
}
function CameraManagementFun({ map, caseManagment }) {
  return { map, caseManagment };
}
export default connect(CameraManagementFun)(CaseManagement);
