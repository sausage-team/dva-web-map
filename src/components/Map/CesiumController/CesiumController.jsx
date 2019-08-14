import React from 'react';
import styles from './CesiumController.css';
import { connect } from 'dva';
import { Button, Select, Spin } from 'antd';
import { FlyRoute } from '../../../services/config';
const Option = Select.Option;
class CesiumController extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    handleChange = (data) => {
        let url = FlyRoute + data.key;
        let flyManager = '';
        let viewer = this.props.cesium.cesiumObj;
        let scene = viewer.scene;
        scene.globe.depthTestAgainstTerrain = false;
        // var camera = scene.camera;
        let routes = new Cesium.RouteCollection();
        routes.fromFile(url);
        //初始化飞行管理
        flyManager = new Cesium.FlyManager({
            scene: scene,
            routes: routes
        });
         flyManager.playRate = 14
        flyManager.stopArrived.addEventListener(function (routeStop) {
            var stopName = routeStop.stopName;
            var entity = new Cesium.Entity({
                description: '到达站点 : ' + stopName,
                name: stopName
            });
            viewer.selectedEntity = entity;
            setTimeout(function () {
                viewer.selectedEntity = undefined;
            }, 1000);
            routeStop.waitTime = 1;
        });
        Cesium.when(flyManager.readyPromise, function () {
            flyManager && flyManager.pause();
            var route = flyManager.currentRoute;
            var stop = route.get(0);
            flyManager.currentStopIndex = 0;
            flyManager.viewToStop(stop);
            flyManager && flyManager.pause();
        })
        this.props.dispatch({
            type: 'simulatedMapBrowsing/setFlyManager',
            payload: flyManager
        })
        //注册站点到达事件
    }
    handleBlur = () => {
        console.log('blur');
    }
    fhandleFocus = () => {
        console.log('focus');
    }
    clickFun = (val) => {
        if (this.props.simulatedMapBrowsing.flyManager) {
            let flyManager = this.props.simulatedMapBrowsing.flyManager;
            switch (val) {
                case 1:
                    flyManager && flyManager.pause()
                    flyManager.playRate = flyManager.playRate + 1
                    flyManager && flyManager.play()
                    break
                case 2:
                    flyManager && flyManager.play()
                    break
                case 3:
                    flyManager && flyManager.pause()
                    break
                case 4:
                    flyManager && flyManager.pause()
                    flyManager.playRate = flyManager.playRate - 1
                    flyManager && flyManager.play()
                    break;
            }
        }
    }
    render() {
        const { children } = this.props.simulatedMapBrowsing;
        return (<div className={styles.indexDiv}>
            <div className={styles.indexDivTop} >
                <Button type="primary" icon="backward" onClick={this.clickFun.bind(this, 1)} />
                <Button type="primary" icon="caret-right" style={{ 'marginLeft': '11px', 'marginRight': '5px' }} onClick={this.clickFun.bind(this, 2)} />
                <Button type="primary" icon="pause-circle" style={{ 'marginLeft': '5px', 'marginRight': '11px' }} onClick={this.clickFun.bind(this, 3)} />
                <Button type="primary" icon="forward" onClick={this.clickFun.bind(this, 4)} />
            </div>
            <Select
                labelInValue
                showSearch
                style={{ width: ' 100%' }}
                placeholder="选择飞行轨迹"
                optionFilterProp="children"
                notFoundContent={children ? <Spin size="small" /> : '当前没有飞行数据'}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {children.map(d => <Option key={d.value}>{d.text}</Option>)}
            </Select>
        </div>)
    }
}
function CesiumControllerFun({ simulatedMapBrowsing, cesium }) {
    return { simulatedMapBrowsing, cesium };
}
export default connect(CesiumControllerFun)(CesiumController);
