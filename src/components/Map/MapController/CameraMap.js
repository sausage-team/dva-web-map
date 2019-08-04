import React from 'react';
import { connect } from 'dva';
import styles from './CameraMap.css';
import { Tabs, Icon, DatePicker, Button, Switch, Radio } from 'antd';
import moment from 'moment';
const { RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class CameraMap extends React.Component {
    constructor(props) {
        super(props);
    }
    changeFun = (date, dateString) => {
        console.log(date, dateString);
        let mapObj = this.props.map.mapObj;
        let mapStart = this.props.cameraAnalysis.mapStart;
        this.props.dispatch({
            type: 'cameraAnalysis/setTime',
            payload: dateString
        })
        if (mapStart == 'a') {
            this.props.dispatch({
                type: 'map/getTSMap',
                payload: { mapObj: mapObj, value: 2, time: dateString }
            })
        } else if (mapStart == 'b') {
            this.props.dispatch({
                type: 'map/getTSHotMap',
                payload: { mapObj: mapObj, value: 2, time: dateString }
            })
        }
    }
    change = (val) => {
        let value = val.target.value
        let mapObj = this.props.map.mapObj;
        let time = this.props.cameraAnalysis.time;
        if (time[0]) {
            if (value == 'a') {
                this.props.dispatch({
                    type: 'map/getTSMap',
                    payload: { mapObj: mapObj, value: 2, time: time }
                })
                mapObj.flyTo({
                    center: [114.3038583200, 30.6479700100],
                    zoom: 11,
                    speed: 0.3,
                    bearing: 0,
                    pitch: 0
                })
            } else {
                mapObj.flyTo({
                    center: [114.3038583200, 30.6479700100],
                    zoom: 11,
                    speed: 0.3,
                    bearing: 0,
                    pitch: 0
                })
                this.props.dispatch({
                    type: 'map/getTSHotMap',
                    payload: { mapObj: mapObj, value: 2, time: time }
                })
            }
        }
        this.props.dispatch({
            type: 'cameraAnalysis/setMapStart',
            payload: value
        })
    }
    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > moment().endOf('day');
    }

    render() {
        const { time, mapStart } = this.props.cameraAnalysis;
        return (
            <div className={styles.main}>
                <RadioGroup defaultValue={time} className={styles.RadioGroup} size="default" onChange={this.change}>
                    <RadioButton value="a">专题图</RadioButton>
                    <RadioButton value="b">热力图</RadioButton>
                </RadioGroup>
                <RangePicker
                    onChange={this.changeFun}
                    placeholder={['开始时间', '结束时间']}
                    disabledDate={this.disabledDate}
                    defaultValue={[moment(time[0], 'YYYY-MM-DD'), moment(time[1], 'YYYY-MM-DD')]}
                    format={'YYYY-MM-DD'}
                />
            </div>
        );
    }
}
function CameraMapFun({ map, cameraAnalysis }) {
    return { map, cameraAnalysis };
}
export default connect(CameraMapFun)(CameraMap);
