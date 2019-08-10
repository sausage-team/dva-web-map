import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import { Input, Button } from 'antd'
import styles from './PavementAnalysis.css';
import Mapbox from '../../../components/Map/Mapbox/Mapbox';
import request from '../../../utils/request';
import Slider from '../../../components/Slider/Slider'
import RadioTab from '../../../components/Radio/Radio';
import SpecialRadio from '../../../components/Radio/SpecialRadio';
import HotRadio from '../../../components/Radio/HotRadio';
import PavementAnalysisTab from '../../../components/DataTab/PavementAnalysisTab';
import PavementModel from '../../../components/Model/PavementModel';
import MapPublic from '../../../components/Map/MapController/MapPublic'
const Search = Input.Search;
class PavementAnalysis extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let mapObj = this.props.map.mapObj;
        this.props.map.mapObj.setStyle(this.props.map.style1);
        this.props.dispatch({
            type: 'mapPublic/setStyleValue',
            payload: ['白天']
        })
        mapObj.on('load', () => {
            // mapObj.removeLayer('网格面@data_outline_0');
            // mapObj.removeLayer('社区边界面@data_outline');
            //点击路面的交互
            mapObj.on('click', 'PavementMap', this.clickFun.bind(this, mapObj, 'PavementMap', 'addPavementMap'));
            //点击路段的交互
            mapObj.on('click', 'SectionMap', this.clickFun.bind(this, mapObj, 'SectionMap', 'addSectionMap'));
            //点击路口的交互
            mapObj.on('click', 'IntersectionMap', this.clickFun.bind(this, mapObj, 'IntersectionMap', 'addIntersectionMap'));
            //点击摄像头的交互
            mapObj.on('click', 'CameraMapPoint', this.clickFun.bind(this, mapObj, 'CameraMapPoint', 'addCameraMapPoint'));
        })
        // this.props.dispatch({
        //     type: 'pavementAnalysis/getPavementData'
        // })
    }
    clickFun = (mapObj, getLayers, setLayers, e) => {
        let bbox = [e.point.x, e.point.y];
        let features = mapObj.queryRenderedFeatures(bbox, { layers: [getLayers] });
        let obj = {};
        if (features[0]) {
            if (features[0].properties.geometry) {
                obj = {
                    'type': 'Feature',
                    'properties': features[0].properties,
                    'geometry': JSON.parse(features[0].properties.geometry)
                }
            } else {
                obj = {
                    'type': 'Feature',
                    'properties': features[0].properties,
                    'geometry': features[0].geometry
                }
            }
        }
        let data = mapObj.getSource(setLayers);
        data = data._data;
        data.features = [obj];
        mapObj.getSource(setLayers).setData(data);
        for (let i in this.props.pavementAnalysis.columns) {
            if (this.props.pavementAnalysis.columns[i].smid == features[0].properties.ID) {
                this.props.dispatch({
                    type: 'map/shutTimeOpen'
                })
                this.props.dispatch({
                    type: 'map/setTimeState',
                    payload: true
                })
                this.props.dispatch({
                    type: 'pavementAnalysis/setSliderShow',
                    payload: false
                })
                this.props.dispatch({
                    type: 'pavementAnalysis/setModelData',
                    payload: this.props.pavementAnalysis.columns[i]
                })
                this.props.dispatch({
                    type: 'pavementAnalysis/setVisible',
                    payload: true
                })
                this.props.dispatch({
                    type: 'pavementAnalysis/setTabShow',
                    payload: true
                })
            }
        }
    }
    onClickFun = () => {
        this.props.dispatch({
            type: 'pavementAnalysis/setTabShow',
            payload: true
        })
        this.props.dispatch({
            type: 'map/setTimeOpen'
        });
        this.props.dispatch({
            type: 'pavementAnalysis/setTabShow',
            payload: false
        })
        this.props.dispatch({
            type: 'pavementAnalysis/setVisible',
            payload: false
        })
        this.props.dispatch({
            type: 'pavementAnalysis/setSliderShow',
            payload: true
        })
    }
    offClickFun = () => {
        if (this.props.pavementAnalysis.mapLayer) {
            this.props.dispatch({
                type: 'map/shutTimeOpen'
            })
            this.props.dispatch({
                type: 'map/setTimeState',
                payload: true
            })
            this.props.dispatch({
                type: 'pavementAnalysis/setSliderShow',
                payload: false
            })
            this.props.dispatch({
                type: 'pavementAnalysis/setTabShow',
                payload: true
            })
        }
    }
    titleFun = () => {
        if (this.props.pavementAnalysis.mapLayer == 1) {
            return '路面';
        } else if (this.props.pavementAnalysis.mapLayer == 2) {
            return '路段';
        } else if (this.props.pavementAnalysis.mapLayer == 3) {
            return '路口';
        } else {
            return '摄像头';
        }
    }
    render() {
        return (
            <div id="mainIndex" className={styles.mainIndex}>
                <div className={styles.tab}>
                    <RadioTab />
                </div>
                <div className={styles.but}>
                    {this.props.pavementAnalysis.tabShow ?
                        <Button shape="circle" icon="appstore-o" onClick={this.onClickFun} /> :
                        <Button shape="circle" icon="appstore" onClick={this.offClickFun} />}
                </div>
                {this.props.pavementAnalysis.tabShow ? <div className={styles.PavementAnalysisTab}>
                    <h2 className={styles.hTwo}>{this.titleFun()}</h2>
                    {/* <Search placeholder="请输入关键字搜索" onSearch={value => console.log(value)} style={{ marginBottom:8 }} /> */}
                    <PavementAnalysisTab />
                </div> : ""}
                <div className={styles.specialTab}>
                    {this.props.map.mapTab == 1 ? <SpecialRadio /> : <HotRadio />}
                </div>
                <Mapbox />
                {this.props.map.timeShowState ? <div>
                    {this.props.pavementAnalysis.sliderShow ? <div className={styles.slider}>
                        <Slider />
                    </div> : ""}
                </div> : ""}
                <div id='model' className={styles.model}>
                    <PavementModel />
                </div>
                <div className={styles.rightTop}>
                    <MapPublic />
                </div>
            </div>
        );
    }
}
function PavementAnalysisFun({ map, pavementAnalysis }) {
    return { map, pavementAnalysis };
}
export default connect(PavementAnalysisFun)(PavementAnalysis);
