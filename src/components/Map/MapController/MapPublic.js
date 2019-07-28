import React from 'react';
import { connect } from 'dva';
import styles from './MapPublic.css';
import { Icon, Checkbox } from 'antd';
import mapboxgl from 'mapbox-gl';
import turf from 'turf';
import html2canvas from 'html2canvas';
require('@supermap/iclient-mapboxgl');
import { NiuniuCaptureObject, rgb2value, StartCapture } from './Niuniu';
import { iserverBasePath,ThreeServerApi } from '../../../services/config'
const CheckboxGroup = Checkbox.Group;
class MapPublic extends React.Component {
    constructor(props) {
        super(props);
        this.options = [
            { label: '城区山区', value: '城区山区' },
            { label: '派出所辖区', value: '派出所辖区' },
            { label: '社区面', value: '社区面' },
        ];
        this.styleOptions = [
            { label: '白天', value: '白天' },
            { label: '黑夜', value: '黑夜' },
            { label: '卫星', value: '卫星' },
        ];
        this.popup = new mapboxgl.Popup({
            closeOnClick: false
        });
    }
    componentDidMount() {
        let map = this.props.map.mapObj;
        map.on('draw.create', this.drawfun.bind(this));
    }
    //全屏和推出全屏
    requestFullScreen = () => {
        // 判断各种浏览器，找到正确的方法
        if (this.props.mapPublic.fullScreen) {
            // 判断各种浏览器，找到正确的方法
            var exitMethod = document.exitFullscreen || //W3C
                document.mozCancelFullScreen || //Chrome等
                document.webkitExitFullscreen || //FireFox
                document.webkitExitFullscreen; //IE11
            if (exitMethod) {
                exitMethod.call(document);
            }
            else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
            this.props.dispatch({
                type: 'mapPublic/setFullScreen',
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
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
            this.props.dispatch({
                type: 'mapPublic/setFullScreen',
                payload: true
            })
        }
    }
    //画线的方法
    distance = () => {
        let drawObj = this.props.map.drawObj;
        drawObj.deleteAll();
        this.props.dispatch({
            type: 'mapPublic/setDrawState',
            payload: 'draw_line_string'
        })
        drawObj.changeMode('draw_line_string');
    }
    //画面的方法
    measure = () => {
        let drawObj = this.props.map.drawObj;
        drawObj.deleteAll();
        this.props.dispatch({
            type: 'mapPublic/setDrawState',
            payload: 'draw_polygon'
        })
        drawObj.changeMode('draw_polygon');
    }
    deletFun = () => {
        let drawObj = this.props.map.drawObj;
        drawObj.deleteAll();
        this.popup.remove();
        this.props.dispatch({
            type: 'mapPublic/setDrawState',
            payload: ''
        })
    }
    //绘画的回调函数
    drawfun = (e) => {
        if (!e.features) {
            return;
        }
        let map = this.props.map.mapObj;
        let drawState = this.props.mapPublic.drawState;
        if (drawState == 'draw_point') {
            let dataCenter = this.props.caseEntry.dataCenter;
            dataCenter.smx = e.features[0].geometry.coordinates[0];
            dataCenter.smy = e.features[0].geometry.coordinates[1];
            this.props.dispatch({
                type: 'caseEntry/setDataCenter',
                payload: dataCenter
            })
            this.props.dispatch({
                type: "caseEntry/setVisible",
                payload: true
            })
        } else if (drawState == 'draw_line_string') {
            let param = e.features[0];
            let length = turf.lineDistance(param).toLocaleString();
            let along = turf.along(param, length / 2);
            this.popup
                .setLngLat(along.geometry.coordinates)
                .setHTML('长度：' + length + '千米<br/>中心点位置：' + along.geometry.coordinates.toString())
                .addTo(map);

        } else if (drawState == 'draw_polygon') {
            let param = e.features[0];
            let area = turf.area(param);
            let center = turf.centroid(param);
            this.popup
                .setLngLat(center.geometry.coordinates)
                .setHTML('面积：' + area + '平方米<br/>质心点位置：' + center.geometry.coordinates.toString())
                .addTo(map);
        }
    }
    changeFun = (checkedValue) => {
        this.props.dispatch({
            type: 'mapPublic/setMapValue',
            payload: checkedValue
        })
        let map = this.props.map.mapObj;
        if (map.getLayer("cqsq")) {
            map.removeLayer("cqsq");
            map.removeSource("cqsq");
        }
        if (map.getLayer("pcsxq")) {
            map.removeLayer("pcsxq");
            map.removeSource("pcsxq");
        }
        if (map.getLayer("sqm")) {
            map.removeLayer("sqm");
            map.removeSource("sqm");
        }
        if (this.props.mapPublic.styleValue[0] == '卫星') {
            for (let i in checkedValue) {
                switch (checkedValue[i]) {
                    case '社区面':
                        var sqlParam2 = new SuperMap.GetFeaturesBySQLParameters({
                            queryParameter: {
                                name: "网格面"
                            },
                            datasetNames: ['data:网格面'],
                            fromIndex: 0,
                            toIndex: 100000
                        });
                        let service2 = new mapboxgl.supermap.FeatureService(iserverBasePath);
                        service2.getFeaturesBySQL(sqlParam2, (serviceResult) => {
                            map.addLayer({
                                "id": "sqm",
                                "type": "line",
                                "source": {
                                    "type": "geojson",
                                    "data": serviceResult.result.features
                                },
                                'layout': {
                                    'line-cap': 'round',
                                    'line-join': 'round'
                                },
                                "paint": {
                                    "line-color": "green", /* 填充的颜色 */
                                    "line-width": 6,
                                    'line-blur': 2,
                                    "line-opacity": 0.8      /* 透明度 */
                                },
                            });
                        })
                        break;
                    case '派出所辖区':
                        let sqlParam1 = new SuperMap.GetFeaturesBySQLParameters({
                            queryParameter: {
                                name: "派出所辖区"
                            },
                            datasetNames: ['data:派出所辖区']
                        });
                        let service1 = new mapboxgl.supermap.FeatureService(iserverBasePath);
                        service1.getFeaturesBySQL(sqlParam1, (serviceResult) => {
                            map.addLayer({
                                "id": "pcsxq",
                                "type": "line",
                                "source": {
                                    "type": "geojson",
                                    "data": serviceResult.result.features
                                },
                                'layout': {
                                    'line-cap': 'round',
                                    'line-join': 'round'
                                },
                                "paint": {
                                    "line-color": "yellow", /* 填充的颜色 */
                                    "line-width": 6,
                                    'line-blur': 2,
                                    "line-opacity": 0.8      /* 透明度 */
                                },
                            });
                        })
                        break;
                    case '城区山区':
                        let sqlParam = new SuperMap.GetFeaturesBySQLParameters({
                            queryParameter: {
                                name: "城区山区"
                            },
                            datasetNames: ['data:城区山区']
                        });
                        let service = new mapboxgl.supermap.FeatureService(iserverBasePath);
                        service.getFeaturesBySQL(sqlParam, (serviceResult) => {
                            map.addLayer({
                                "id": "cqsq",
                                "type": "line",
                                "source": {
                                    "type": "geojson",
                                    "data": serviceResult.result.features
                                },
                                'layout': {
                                    'line-cap': 'round',
                                    'line-join': 'round'
                                },
                                "paint": {
                                    "line-color": "red", /* 填充的颜色 */
                                    "line-width": 6,
                                    'line-blur': 2,
                                    "line-opacity": 0.8      /* 透明度 */
                                },
                            });
                        })
                        break;
                    default:
                        break;
                }
            }
            return;
        }
        map.setLayoutProperty('城区山区@data#1_山区_outline', 'visibility', 'none');
        map.setLayoutProperty('城区山区@data#1_城区_outline', 'visibility', 'none');
        map.setLayoutProperty('派出所辖区@data_outline', 'visibility', 'none');
        map.setLayoutProperty('派出所辖区@data#1', 'visibility', 'none');
        map.setLayoutProperty('网格面@data_outline_0', 'visibility', 'none');
        map.setLayoutProperty('网格面@data#1', 'visibility', 'none');
        for (let i in checkedValue) {
            switch (checkedValue[i]) {
                case '城区山区':
                    map.setLayoutProperty('城区山区@data#1_山区_outline', 'visibility', 'visible');
                    map.setLayoutProperty('城区山区@data#1_城区_outline', 'visibility', 'visible');
                    break;
                case '派出所辖区':
                    map.setLayoutProperty('派出所辖区@data_outline', 'visibility', 'visible');
                    map.setLayoutProperty('派出所辖区@data#1', 'visibility', 'visible');
                    break;
                case '社区面':
                    map.setLayoutProperty('网格面@data_outline_0', 'visibility', 'visible');
                    map.setLayoutProperty('网格面@data#1', 'visibility', 'visible');
                    break;
                default:
                    break;
            }
        }
    }
    styleChange = (checkedValue) => {
        let styleValue = this.props.mapPublic.styleValue;
        let mapObj = this.props.map.mapObj;
        let arr = [];
        if (checkedValue.length == 0) {
            arr = styleValue;
        } else if (checkedValue.length == 1) {
            arr[0] = checkedValue[0];
        } else if (checkedValue.length == 2) {
            arr[0] = checkedValue[1];
        }
        switch (arr[0]) {
            case '白天':
                mapObj.setStyle(this.props.map.style1);
                mapObj.flyTo({
                    center: [115.78452, 39.99631],
                    zoom: 10,
                    speed: 0.5,
                    bearing: 0,
                    pitch: 0
                })
                break;
            case '黑夜':
                mapObj.setStyle(this.props.map.style2);
                mapObj.flyTo({
                    center: [115.78452, 39.99631],
                    zoom: 10,
                    speed: 0.5,
                    bearing: 0,
                    pitch: 0
                })
                break;
            case '卫星':
                let mapStyle = {
                    "version": 8,
                    "sources": {
                        "raster-tiles": {
                            "type": "raster",
                            "tiles": [`${ThreeServerApi}map-ugcv5-MTGWGS84BZ/rest/maps/MTGWGS84BZ/zxyTileImage.png?prjCoordSys={"epsgCode":3857}&z={z}&x={x}&y={y}`],
                            "tileSize": 256,
                        }
                    },
                    "layers": [{
                        "id": "simple-tiles",
                        "type": "raster",
                        "source": "raster-tiles",
                        maxZoom: 18,
                        minZoom: 10
                    }]
                }
                mapObj.setStyle(mapStyle);
                mapObj.flyTo({
                    center: [115.78452, 39.99631],
                    zoom: 10,
                    bearing: 0,
                    speed: 0.5,
                    pitch: 0
                })
                break;
            default:
                break;
        }
        mapObj.on('styledata', () => {
            if (this.props.mapPublic.styleValue[0] == '卫星') {
                return;
            }
            let mapValue = this.props.mapPublic.mapValue;
            mapObj.setLayoutProperty('城区山区@data#1_山区_outline', 'visibility', 'none');
            mapObj.setLayoutProperty('城区山区@data#1_城区_outline', 'visibility', 'none');
            mapObj.setLayoutProperty('派出所辖区@data_outline', 'visibility', 'none');
            mapObj.setLayoutProperty('派出所辖区@data#1', 'visibility', 'none');
            mapObj.setLayoutProperty('网格面@data_outline_0', 'visibility', 'none');
            mapObj.setLayoutProperty('网格面@data#1', 'visibility', 'none');
            for (let i in mapValue) {
                switch (mapValue[i]) {
                    case '城区山区':
                        mapObj.setLayoutProperty('城区山区@data#1_山区_outline', 'visibility', 'visible');
                        mapObj.setLayoutProperty('城区山区@data#1_城区_outline', 'visibility', 'visible');
                        break;
                    case '派出所辖区':
                        mapObj.setLayoutProperty('派出所辖区@data_outline', 'visibility', 'visible');
                        mapObj.setLayoutProperty('派出所辖区@data#1', 'visibility', 'visible');
                        break;
                    case '社区面':
                        mapObj.setLayoutProperty('网格面@data_outline_0', 'visibility', 'visible');
                        mapObj.setLayoutProperty('网格面@data#1', 'visibility', 'visible');
                        break;
                    default:
                        break;
                }
            }
        })
        this.props.dispatch({
            type: 'mapPublic/setStyleValue',
            payload: arr
        })
    }
    mapController = () => {
        let mapState = !this.props.mapPublic.mapState;
        this.props.dispatch({
            type: 'mapPublic/setMapState',
            payload: mapState
        })
        this.props.dispatch({
            type: 'mapPublic/setStyleState',
            payload: false
        })
    }
    styleController = () => {
        let styleState = !this.props.mapPublic.styleState;
        this.props.dispatch({
            type: 'mapPublic/setMapState',
            payload: false
        })
        this.props.dispatch({
            type: 'mapPublic/setStyleState',
            payload: styleState
        })
    }
    mapPublicHidden = () => {
        this.props.dispatch({
            type: 'mapPublic/setMapPublicState',
            payload: false
        })
        this.props.dispatch({
            type: 'mapPublic/setMapState',
            payload: false
        })
        this.props.dispatch({
            type: 'mapPublic/setStyleState',
            payload: false
        })
    }
    mapPublicShow = () => {
        this.props.dispatch({
            type: 'mapPublic/setMapPublicState',
            payload: true
        })
    }
    phontFun = () => {
        StartCapture()
    }
    render() {
        return (
            <div className={styles.main}>
                {this.props.mapPublic.mapPublicState ?
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
                        <div className={styles.divItem} onClick={this.deletFun}>
                            <Icon className={styles.Icon} type="delete" style={{ fontSize: 16, color: '#08c' }} />
                            <span className={styles.spanItem}>删除</span>
                        </div>
                        <div className={styles.divItem} onClick={this.phontFun}>
                            <Icon className={styles.Icon} type="file" style={{ fontSize: 16, color: '#08c' }} />
                            <span className={styles.spanItem}>截图</span>
                        </div>
                        <div className={styles.divItem}>
                            <Icon className={styles.Icon} type="switcher" style={{ fontSize: 16, color: '#08c' }} onClick={this.mapController} />
                            <span className={styles.spanItem} onClick={this.mapController}>业务网格</span>
                            {this.props.mapPublic.mapState ? <div className={styles.checke}>
                                <CheckboxGroup options={this.options} value={this.props.mapPublic.mapValue} onChange={this.changeFun} />
                            </div> : ''}
                        </div>
                        <div className={styles.divItem}>
                            <Icon className={styles.Icon} type="appstore-o" style={{ fontSize: 16, color: '#08c' }} onClick={this.styleController} />
                            <span className={styles.spanItem} onClick={this.styleController}>风格</span>
                            {this.props.mapPublic.styleState ? <div className={styles.styleChecke}>
                                <CheckboxGroup options={this.styleOptions} value={this.props.mapPublic.styleValue} onChange={this.styleChange} />
                            </div> : ''}
                        </div>
                        <div className={styles.divItem} style={{ borderRight: 'none' }} onClick={this.mapPublicHidden}>
                            <Icon className={styles.Icon} type="right" style={{ fontSize: 16, color: '#08c' }} />
                        </div>
                    </div> :
                    <div className={styles.divItem} style={{ borderRight: 'none', padding: '0 4px' }} onClick={this.mapPublicShow}>
                        <Icon className={styles.Icon} type="left" style={{ fontSize: 16, color: '#08c' }} />
                    </div>}
            </div>
        );
    }
}
function MapPublicFun({ map, mapPublic, caseEntry }) {
    return { map, mapPublic, caseEntry };
}
export default connect(MapPublicFun)(MapPublic);
