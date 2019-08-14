import React from 'react';
import styles from './Radio.css';
import { connect } from 'dva';
import { Radio, Icon } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class HotRadio extends React.Component {
    constructor(props) {
        super(props);
    }
    changeFun = (e) => {
        let mapObj = this.props.map.mapObj
        let columns = []
        if (this.props.map.mapTab == 2) {
            switch (e.target.value) {
                case '1':

                    break;
                case '2':
                    this.props.dispatch({
                        type: 'map/getSectionHotMap',
                        payload: { mapObj: mapObj, value: 2 }
                    })
                    break;
                case '3':
                    mapObj.flyTo({
                        center: [114.3038583200, 30.6479700100],
                        zoom: 11.5,
                        speed: 0.5,
                        bearing: 0,
                        pitch: 0
                    })
                    this.props.dispatch({
                        type: 'map/getIntersectionHotMap',
                        payload: { mapObj: mapObj, value: 2 }
                    })
                    break;
                case '4':
                    for (let i in this.props.pavementAnalysis.pavementAnalysisData.cameraList) {
                        let obj = {
                            key: this.props.pavementAnalysis.pavementAnalysisData.cameraList[i].smid,
                            ...this.props.pavementAnalysis.pavementAnalysisData.cameraList[i]
                        }
                        columns.push(obj)
                    }
                    this.props.dispatch({
                        type: 'pavementAnalysis/setTabTitle',
                        payload: this.columns
                    })
                    this.props.dispatch({
                        type: 'map/getCameraMap',
                        payload: { mapObj: mapObj, value: 2 }
                    })
                    break;
            }
            this.props.dispatch({
                type: 'pavementAnalysis/setSliderShow',
                payload: true
            })
        }
    }
    render() {
        return (
            <RadioGroup size="large" onChange={this.changeFun}>
                <RadioButton value="2"><Icon type="swap" />路段</RadioButton>
                <RadioButton value="3"><Icon type="fork" />路口</RadioButton>
                {/* <RadioButton value="4"><Icon type="eye-o" />摄像头</RadioButton> */}
            </RadioGroup>
        );
    }
}
function hotRadioModel({ map, pavementAnalysis }) {
    return { map, pavementAnalysis };
}
export default connect(hotRadioModel)(HotRadio);
