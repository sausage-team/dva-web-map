import React from 'react';
// import styles from './Radio.css';
import { connect } from 'dva';
import { Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class RadioTab extends React.Component {
    constructor(props) {
        super(props);
    }
    changeFun = (e) => {
        if (e.target.value == 1) {
            let mapObj = this.props.map.mapObj;
            mapObj.flyTo({
                center: [114.3038583200, 30.6479700100],
                zoom: 12,
                speed: 0.5,
                bearing:0,
                pitch: 0
            })
        } else {
            let mapObj = this.props.map.mapObj;
            mapObj.flyTo({
                center: [114.3038583200, 30.6479700100],
                zoom: 12,
                speed: 0.5,
                bearing:0,
                pitch: 0
            })
        }
        this.props.dispatch({
            type: 'pavementAnalysis/setMapLayer',
            payload: ''
        })
        this.props.dispatch({
            type: 'pavementAnalysis/setTabShow',
            payload: false
        })
        this.props.dispatch({
            type: 'pavementAnalysis/setVisible',//sliderShow
            payload: false
        })
        this.props.dispatch({
            type: 'pavementAnalysis/setSliderShow',
            payload: false
        })
        this.props.dispatch({
            type: 'map/setMapTab',
            payload: e.target.value
        })
        this.props.dispatch({
            type: 'map/clearMapLayer'
        })
    }
    render() {
        return (
            <RadioGroup defaultValue="1" onChange={this.changeFun}>
                <RadioButton value="1">分段专题图</RadioButton>
                <RadioButton value="2">热力图</RadioButton>
            </RadioGroup>
        );
    }
}
function radioTabModel({ map }) {
    return { map };
}
export default connect(radioTabModel)(RadioTab);
