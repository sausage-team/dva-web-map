import React from 'react';
import styles from './CesiumPublic.css';
import { connect } from 'dva';
import { Icon } from 'antd';
// import { NiuniuCaptureObject, rgb2value, StartCapture } from '../MapController/Niuniu'
class CesiumPublic extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let viewer = this.props.cesium.cesiumObj;
        this.handlerDis = new Cesium.MeasureHandler(this.props.cesium.cesiumObj, Cesium.MeasureMode.Distance, 0);
        //注册测距功能事件
        this.handlerDis.measureEvt.addEventListener((result) => {
            if (result.distance) {
                result.distance = parseFloat(result.distance);
                var distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance.toFixed(2) + 'm';
                this.handlerDis.disLabel.text = '距离:' + distance;
            }
        });
        this.handlerDis.activeEvt.addEventListener((isActive) => {
            let bodyObj = document.getElementsByTagName('body')[0];
            if (isActive == true) {
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                bodyObj.className = 'measureCur';
            } else {
                viewer.enableCursorStyle = true;
                bodyObj.className = '';
            }
        });
        //注册测面功能事件
        this.handlerArea = new Cesium.MeasureHandler(this.props.cesium.cesiumObj, Cesium.MeasureMode.Area, 0);
        this.handlerArea.measureEvt.addEventListener((result) => {
            if (result.area) {
                result.area = parseFloat(result.area);
                var area = result.area > 1000000 ? (result.area / 1000000).toFixed(2) + 'km²' : result.area.toFixed(2) + '㎡'
                this.handlerArea.areaLabel.text = '面积:' + area;
            }
        });
        this.handlerArea.activeEvt.addEventListener((isActive) => {
            let bodyObj = document.getElementsByTagName('body')[0];
            if (isActive == true) {
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                bodyObj.className = 'measureCur';
            }
            else {
                viewer.enableCursorStyle = true;
                bodyObj.className = '';
            }
        });
        //注册测高功能事件
        this.handlerHeight = new Cesium.MeasureHandler(this.props.cesium.cesiumObj, Cesium.MeasureMode.DVH);
        this.handlerHeight.measureEvt.addEventListener((result) => {
            var distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm';
            var vHeight = result.verticalHeight > 1000 ? (result.verticalHeight / 1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
            var hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance / 1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
            this.handlerHeight.disLabel.text = '空间距离:' + distance;
            this.handlerHeight.vLabel.text = '垂直高度:' + vHeight;
            this.handlerHeight.hLabel.text = '水平距离:' + hDistance;
        });
        this.handlerHeight.activeEvt.addEventListener((isActive) => {
            let bodyObj = document.getElementsByTagName('body')[0];
            if (isActive == true) {
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                bodyObj.className = 'measureCur';
            }
            else {
                viewer.enableCursorStyle = true;
                bodyObj.className = '';
            }
        });
    }
    requestFullScreen = () => {
        // 判断各种浏览器，找到正确的方法
        if (this.props.cesiumPublic.fullScreen) {
            // 判断各种浏览器，找到正确的方法
            var exitMethod = document.exitFullscreen || //W3C
                document.mozCancelFullScreen || //Chrome等
                document.webkitExitFullscreen || //FireFox
                document.webkitExitFullscreen; //IE11
            if (exitMethod) {
                exitMethod.call(document);
            }
            else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
                const ActiveXObject = window.ActiveXObject
                let wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
            this.props.dispatch({
                type: 'cesiumPublic/setFullScreen',
                payload: false
            })
        } else {
            let element = document.getElementById('root');
            var requestMethod = element.requestFullScreen || //W3C
                element.webkitRequestFullScreen || //Chrome等
                element.mozRequestFullScreen || //FireFox
                element.msRequestFullScreen; //IE11
            if (requestMethod) {
                requestMethod.call(element);
            }
            else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
                const ActiveXObject = window.ActiveXObject
                let wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
            this.props.dispatch({
                type: 'cesiumPublic/setFullScreen',
                payload: true
            })
        }
    };
    distance = () => {
        this.deactiveAll();
        this.handlerDis && this.handlerDis.activate();
    }
    measure = () => {
        this.deactiveAll();
        this.handlerArea && this.handlerArea.activate();
    }
    handlerHeightFun = () => {
        this.deactiveAll();
        this.handlerHeight && this.handlerHeight.activate();
    }
    deletFun = () => {
        this.handlerDis && this.handlerDis.clear();
        this.handlerArea && this.handlerArea.clear();
        this.handlerHeight && this.handlerHeight.clear();
    }
    changeModel = () => {
        if (this.props.cesiumPublic.changeModel) {
            this.handlerArea.clampMode = 0;
            this.handlerDis.clampMode = 0;
            this.props.dispatch({
                type: 'cesiumPublic/setChangeModel',
                payload: 0
            })
        } else {
            this.handlerArea.clampMode = 1;
            this.handlerDis.clampMode = 1;
            this.props.dispatch({
                type: 'cesiumPublic/setChangeModel',
                payload: 1
            })
        }
    }
    deactiveAll = () => {
        this.handlerDis && this.handlerDis.deactivate();
        this.handlerArea && this.handlerArea.deactivate();
        this.handlerHeight && this.handlerHeight.deactivate();
    }
    mapPublicHidden = () => {
        this.props.dispatch({
            type: 'cesiumPublic/setMapPublicState',
            payload: false
        })
    }
    mapPublicShow = () => {
        this.props.dispatch({
            type: 'cesiumPublic/setMapPublicState',
            payload: true
        })
    }
    phontFun = () => {
        // StartCapture()
    }
    render() {
        return (<div className={styles.main}>
            {this.props.cesiumPublic.mapPublicState ?
                <div>
                    <div className={styles.divItem} onClick={this.requestFullScreen}>
                        <Icon className={styles.Icon} type="global" style={{ fontSize: 16, color: '#08c' }} />
                        <span className={styles.spanItem}>全屏</span>
                    </div>
                    <div className={styles.divItem} onClick={this.distance}>
                        <Icon className={styles.Icon} type="arrows-alt" style={{ fontSize: 16, color: '#08c' }} />
                        <span className={styles.spanItem}>距离</span>
                    </div>
                    <div className={styles.divItem} onClick={this.measure}>
                        <Icon className={styles.Icon} type="scan" style={{ fontSize: 16, color: '#08c' }} />
                        <span className={styles.spanItem}>面积</span>
                    </div>
                    <div className={styles.divItem} onClick={this.handlerHeightFun}>
                        <Icon className={styles.Icon} type="arrow-up" style={{ fontSize: 16, color: '#08c' }} />
                        <span className={styles.spanItem}>测高</span>
                    </div>
                    <div className={styles.divItem} onClick={this.phontFun}>
                        <Icon className={styles.Icon} type="file" style={{ fontSize: 16, color: '#08c' }} />
                        <span className={styles.spanItem}>截图</span>
                    </div>
                    <div className={styles.divItem} onClick={this.changeModel}>
                        <Icon className={styles.Icon} type="arrow-down" style={{ fontSize: 16, color: '#08c' }} />
                        {this.props.cesiumPublic.changeModel ? <span className={styles.spanItem}>空间</span> : <span className={styles.spanItem}>贴地</span>}
                    </div>
                    <div className={styles.divItem} onClick={this.deletFun}>
                        <Icon className={styles.Icon} type="delete" style={{ fontSize: 16, color: '#08c' }} />
                        <span className={styles.spanItem}>删除</span>
                    </div>
                    <div className={styles.divItem} style={{ borderRight: 'none' }} onClick={this.mapPublicHidden}>
                        <Icon className={styles.Icon} type="right" style={{ fontSize: 16, color: '#08c' }} />
                    </div>
                </div> :
                <div className={styles.divItem} style={{ borderRight: 'none', padding: '0 4px' }} onClick={this.mapPublicShow}>
                    <Icon className={styles.Icon} type="left" style={{ fontSize: 16, color: '#08c' }} />
                </div>}
        </div>)
    }
}
function CesiumPublicFun({ cesium, cesiumPublic }) {
    return { cesium, cesiumPublic };
}
export default connect(CesiumPublicFun)(CesiumPublic);
