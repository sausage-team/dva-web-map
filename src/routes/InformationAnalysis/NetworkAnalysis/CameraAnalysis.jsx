import React from 'react';
import { connect } from 'dva';
import styles from './CameraAnalysis.css';
import Mapbox from '../../../components/Map/Mapbox/Mapbox';
import CameraMap from '../../../components/Map/MapController/CameraMap';
import CameraAnalysisTab from '../../../components/DataTab/cameraAnalysisTab';
import MapPublic from '../../../components/Map/MapController/MapPublic'
class CameraAnalysis extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // let mapObj = this.props.map.mapObj;
        this.props.map.mapObj.setStyle(this.props.map.style1);
        this.props.dispatch({
            type: 'mapPublic/setStyleValue',
            payload: ['白天']
        })
    }
    render() {
        return (
            <div id="mainIndex" className={styles.mainIndex}>
                <Mapbox />
                <div className={styles.leftTop}>
                    <CameraMap />
                </div>
                {this.props.cameraAnalysis.tabShow ? <div className={styles.PavementAnalysisTab}>
                    {/* <Search placeholder="请输入关键字搜索" onSearch={value => console.log(value)} style={{ marginBottom:8 }} /> */}
                    <CameraAnalysisTab />
                </div> : ""}
                <div className={styles.rightTop}>
                    <MapPublic />
                </div>
            </div>
        );
    }
}
function CameraAnalysisFun({ map, cameraAnalysis }) {
    return { map, cameraAnalysis };
}
export default connect(CameraAnalysisFun)(CameraAnalysis);
