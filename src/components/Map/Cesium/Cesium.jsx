import React from 'react';
import styles from './Cesium.css';
import '../../../../Cesium/Workers/zlib.min.js';
import { connect } from 'dva';
import img from '../../../../public/worldimage.jpg';
import { ThreeServerApi } from '../../../services/config';
class CesiumMap extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const imageryProvider = new Cesium.SingleTileImageryProvider({
            url: img
        });
        // const terrainProvider = new Cesium.CesiumTerrainProvider({
        //     url: ThreeServerApi + '3D-yingxiang3dwgs84/rest/realspace/datas/MTG_dem',
        //     requestWaterMask: true,
        //     requestVertexNormals: true,
        //     isSct: true,
        // });
        let cesiumView = new Cesium.Viewer('cesium'
            , {
                animation: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                geocoder: false,
                homeButton: false,
                infoBox: false,
                sceneModePicker: false,
                selectionIndicator: true,
                timeline: false,
                navigationHelpButton: false,
                scene3DOnly: true,
                imageryProvider,
                //terrainProvider
            }
        )
        this.props.dispatch({
            type: 'cesium/setCesiumObj',
            payload: cesiumView
        })
        // var layer = cesiumView.imageryLayers.addImageryProvider(new Cesium.SuperMapImageryProvider({
        //     url: 'http://127.0.0.1:8090/iserver/services/3D-yingxiang3dwgs84/rest/realspace/datas/MTG5'
        // }));
        var scene = cesiumView.scene;
        var widget = cesiumView.cesiumWidget;
        //添加倾斜摄影测量的数据
        // var promise = scene.addS3MTilesLayerByScp('http://192.168.1.116:8090/iserver/services/3D-MTG3DQXSY/rest/realspace/datas/Config/config', {
        //     name: 'Config'
        // });
        var promise = scene.addS3MTilesLayerByScp('http://127.0.0.1:8090/iserver/services/3D-MTG3DQXSY/rest/realspace/datas/Config/config', {
            name: 'Config'
        });
        // var promise1 = scene.addS3MTilesLayerByScp('http://192.168.1.122:8090/iserver/services/3D-MTG3D1/rest/realspace/datas/Camera/config', {
        //     name: 'Camera'
        // });
        // let openUrl = ThreeServerApi + '3D-MTG3DQXSY/rest/realspace';
        let openUrl1 = ThreeServerApi + '3D-MTG3DYXDEM/rest/realspace';
//        let obj = scene.open(openUrl)
        let obj1 = scene.open(openUrl1)
        // Cesium.when(obj, () => {

        // })
        // cesiumView.dataSources.add(Cesium.KmlDataSource.load('http://localhost:8090/iserver/services/3D-qingxiesheying/rest/realspace/datas/camera/config',{
        //     camera : cesiumView.scene.camera,
        //     canvas : cesiumView.scene.canvas
        // })).then(function(dataSource){
        //     cesiumView.clock.clockRange = Cesium.ClockRange.CLAMPED;
        // });
        Cesium.when(obj1, function (layer) {
            cesiumView.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(116.08, 39.912453300920916, 16000.8147941154),
                orientation: {
                    heading: Cesium.Math.toRadians(20.0),
                    pitch: Cesium.Math.toRadians(-90.0),
                    roll: 0.0
                }
            });
        }, function (e) {
            if (widget._showRenderLoopErrors) {
                var title = '渲染时发生错误，已停止渲染。';
                widget.showErrorPanel(title, undefined, e);
            }
        });
        this.props.dispatch({
            type: 'cesium/setCesiumObj',
            payload: cesiumView
        })
    }
    render() {
        return (
            <div id="cesium" className={styles.cesium}></div>
        )
    }
}
function CesiumFun(cesium) {
    return cesium;
}
export default connect(CesiumFun)(CesiumMap);
