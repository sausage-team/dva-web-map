import React from 'react';
import styles from './Radio.css';
import { connect } from 'dva';
import { Radio, Icon } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class SpecialRadio extends React.Component {
    constructor(props) {
        super(props);
    }
    changeFun = (e) => {
        let mapObj = this.props.map.mapObj
        if (this.props.map.mapTab == 1) {
            let columns = [];
            this.props.dispatch({
                type: 'pavementAnalysis/setTabShow',
                payload: false
            })
            this.props.dispatch({
                type: 'pavementAnalysis/setVisible',
                payload: false
            })
            this.props.dispatch({
                type: 'pavementAnalysis/setLoading',
                payload: true
            })
            this.props.dispatch({
                type: 'pavementAnalysis/setTabTitle',
                payload: this.columns
            })
            switch (e.target.value) {
                case '1':
                    for (let i in this.props.pavementAnalysis.pavementAnalysisData.areaCount) {
                        let obj = {
                            key: this.props.pavementAnalysis.pavementAnalysisData.areaCount[i].smid,
                            ...this.props.pavementAnalysis.pavementAnalysisData.areaCount[i]
                        }
                        columns.push(obj)
                    }
                    mapObj.flyTo({
                        center: [114.60955588089992, 30.589574087170054],
                        zoom: 11.5,
                        speed: 0.5,
                        bearing:0,
                        pitch: 0
                    })
                    this.props.dispatch({
                        type: 'map/getPavementMap',
                        payload: { mapObj: mapObj, value: 2 }
                    })
                    break;
                case '2':
                    for (let i in this.props.pavementAnalysis.pavementAnalysisData.roadCount) {
                        if (this.props.pavementAnalysis.pavementAnalysisData.roadCount[i].list) {
                            for (let j in this.props.pavementAnalysis.pavementAnalysisData.roadCount[i].list) {
                                this.props.pavementAnalysis.pavementAnalysisData.roadCount[i].list[j] = {
                                    ...{ key: this.props.pavementAnalysis.pavementAnalysisData.roadCount[i].list[j].smid },
                                    ...this.props.pavementAnalysis.pavementAnalysisData.roadCount[i].list[j]
                                }
                            }
                        }
                        let obj = {
                            key: this.props.pavementAnalysis.pavementAnalysisData.roadCount[i].smid,
                            ...this.props.pavementAnalysis.pavementAnalysisData.roadCount[i]
                        }
                        columns.push(obj)
                    }
                    mapObj.flyTo({
                        center: [114.60955588089992, 30.589574087170054],
                        zoom: 11.5,
                        speed: 0.5,
                        bearing:0,
                        pitch: 0
                    })
                    this.props.dispatch({
                        type: 'map/getSectionMap',
                        payload: { mapObj: mapObj, value: 2 }
                    })
                    break;
                case '3':
                    for (let i in this.props.pavementAnalysis.pavementAnalysisData.pointCount) {
                        if (this.props.pavementAnalysis.pavementAnalysisData.pointCount[i].list) {
                            for (let j in this.props.pavementAnalysis.pavementAnalysisData.pointCount[i].list) {
                                this.props.pavementAnalysis.pavementAnalysisData.pointCount[i].list[j] = {
                                    ...{ key: this.props.pavementAnalysis.pavementAnalysisData.pointCount[i].list[j].smid },
                                    ...this.props.pavementAnalysis.pavementAnalysisData.pointCount[i].list[j]
                                }
                            }
                        }
                        let obj = {
                            key: this.props.pavementAnalysis.pavementAnalysisData.pointCount[i].smid,
                            ...this.props.pavementAnalysis.pavementAnalysisData.pointCount[i]
                        }
                        columns.push(obj)
                    }
                    mapObj.flyTo({
                        center: [114.60955588089992, 30.589574087170054],
                        zoom: 11.5,
                        speed: 0.5,
                        bearing:0,
                        pitch: 0
                    })
                    this.props.dispatch({
                        type: 'map/getIntersectionMap',
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
                    mapObj.flyTo({
                        center: [114.60955588089992, 30.589574087170054],
                        zoom: 11.5,
                        speed: 0.5,
                        bearing:0,
                        pitch: 0
                    })
                    this.props.dispatch({
                        type: 'pavementAnalysis/setTabTitle',
                        payload: this.columns1
                    })
                    this.props.dispatch({
                        type: 'map/getCameraMap',
                        payload: { mapObj: mapObj, value: 2 }
                    })
                    break;
            }
            this.props.dispatch({
                type: 'pavementAnalysis/setColumns',
                payload: columns
            })
            this.props.dispatch({
                type: 'pavementAnalysis/setMapLayer',
                payload: e.target.value
            })
            this.props.dispatch({
                type: 'pavementAnalysis/setSliderShow',
                payload: true
            })
            this.props.dispatch({
                type: 'pavementAnalysis/setLoading',
                payload: false
            })
        }
    }
    render() {
        return (
            <RadioGroup size="large" onChange={this.changeFun}>
                <RadioButton value="1"><Icon type="scan" />路面</RadioButton>
                <RadioButton value="2"><Icon type="swap" />路段</RadioButton>
                <RadioButton value="3"><Icon type="fork" />路口</RadioButton>
                <RadioButton value="4"><Icon type="eye-o" />摄像头</RadioButton>
            </RadioGroup>
        );
    }
}
function specialRadioModel({ pavementAnalysis, map }) {
    return { pavementAnalysis, map };
}
export default connect(specialRadioModel)(SpecialRadio);
