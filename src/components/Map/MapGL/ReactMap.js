import React, { Compnents } from 'react';
import styles from './ReactMap.css';
import * as d3 from 'd3';
import MapGL, { SVGOverlay, FlyToInterpolator } from 'react-map-gl';
import { connect } from 'dva';
class ReactMap extends React.Component {
    constructor(props, { location }) {
        super(props);
    }
    //全局的定时器
    timeOut = () => {
        let stateTime = this.props.map.stateTime;
        let endTime = this.props.map.endTime;
        let timeOut = setInterval(() => {
            let time = this.props.map.time;
            if (time < endTime) {
                time += 24;
            } else {
                time = 0;
            }
            this.props.dispatch({
                type: 'map/setTime',
                payload: time
            })
            let num = parseInt(time / 87.6)
            this.props.dispatch({
                type: 'map/setMarks',
                payload: num
            })
            this.props.dispatch({
                type: 'map/hotMapOpen'
            })
            this.props.dispatch({
                type: 'map/gridMapOpen'
            })
            //  this.props.dispatch({
            //   type:'map/custersMapOpen'
            // })
        }, stateTime);
        this.props.dispatch({
            type: 'map/setTimeOut',
            payload: timeOut
        })
    }
    //设置全局的时间
    setTime = () => {
        this.props.dispatch({
            type: 'map/setTimeFun',
            payload: this.timeOut.bind(this)
        })
    }
    componentDidMount() {
        window.addEventListener('resize', this._resize.bind(this));
        this._resize();
        this.setTime();
    }
    onLoadMapSource = (e) => {
        const map = e.target;
        this.props.dispatch({
            type: 'map/setMapReactObj',
            payload: map
        })
        //增加建筑面高度
        // map.addLayer({
        //     'id': '3d-buildings',
        //     'source': 'map',
        //     "source-layer": "建筑物@mtg",
        //     'type': 'fill-extrusion',
        //     "minzoom": 10,
        //     "maxzoom": 24,
        //     "paint": {
        //         "fill-extrusion-color": "rgb(255, 255, 255)",
        //         "fill-extrusion-height": 50,
        //         'fill-extrusion-opacity':0.5
        //     }
        // });
        // map.on('load', () => {
        map.setLayoutProperty('城区山区@data#1_山区_outline', 'visibility', 'none');
        map.setLayoutProperty('城区山区@data#1_城区_outline', 'visibility', 'none');
        // map.setLayoutProperty('派出所辖区@data_outline', 'visibility', 'none');
        // map.setLayoutProperty('派出所辖区@data#1', 'visibility', 'none');
        map.setLayoutProperty('网格面@data_outline_0', 'visibility', 'none');
        map.setLayoutProperty('网格面@data#1', 'visibility', 'none');
        // let mapValue = this.props.mapPublic.mapValue;
        // for (let i in mapValue) {
        //     switch (mapValue[i]) {
        //         case '城区山区':
        //             map.setLayoutProperty('城区山区@data#1_山区_outline', 'visibility', 'visible');
        //             map.setLayoutProperty('城区山区@data#1_城区_outline', 'visibility', 'visible');
        //             break;
        //         case '派出所辖区':
        //             map.setLayoutProperty('派出所辖区@data_outline', 'visibility', 'visible');
        //             map.setLayoutProperty('派出所辖区@data#1', 'visibility', 'visible');
        //             break;
        //         case '社区面':
        //             map.setLayoutProperty('网格面@data_outline_0', 'visibility', 'visible');
        //             map.setLayoutProperty('网格面@data#1', 'visibility', 'visible');
        //             break;
        //         default:
        //             break;
        //     }
        // }
        // })
        // map.on("load", () => {
        // console.log(location.hash)
        if (location.hash == '#/NuclearDensityAnalysis') {
            this.props.dispatch({ type: 'map/getSpecialMap', payload: { value: 1, mapObj: map } });
        }
        if (location.hash == '#/CameraManagement') {
            this.props.dispatch({ type: 'map/getHotMapTwo', payload: map });
        }
        if (location.hash == '#/PersonnelManagement') {
            this.props.dispatch({ type: 'map/getHotMapThree', payload: map });
        }
        // })
        let viewport = {
            // longitude: 115.78452,
            // latitude: 39.99631,
            longitude: 114.3038583200,
            latitude: 30.6479700100,
            zoom: 13,
            pitch: 0,
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: 1500
        }
        this.props.dispatch({
            type: 'map/viewportChange',
            payload: viewport
        });
    }
    _resize() {
        this._onViewportChange({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }
    componentWillUnmount() {
        if (this._animationFrame) {
            window.cancelAnimationFrame(this._animationFrame);
        }
    }

    _onViewportChange(viewport) {
        this.props.dispatch({
            type: 'map/viewportChange',
            payload: viewport
        })
    }
    _removeMissingdivCss = () => {
        const missingdiv = document.querySelector(".mapboxgl-missing-css");
        if (missingdiv) missingdiv.style.display = "none";
    }
    //将人口专题上的图形添加到地图上.其中包括  barChart gridChart odChart heatMap
    render() {
        const { viewport, MAPBOX_TOKEN, data } = this.props.map;
        return (
            <div className={styles.map} id="mapContainer">
                <MapGL
                    {...viewport}
                    mapStyle={this.props.map.style2}
                    onViewportChange={this._onViewportChange.bind(this)}  //  用户与地图交互时触发的回调。传递给回调对象包含视口性能如 longitude，latitude，zoom等。
                    mapboxApiAccessToken={this.props.map.accessToken}
                    onLoad={this.onLoadMapSource}
                    removeMissingdivCss={this._removeMissingdivCss()}
                >
                    {this.props.children}
                </MapGL>
            </div>
        );
    }
}
function ReactMapFun({ map, mapPublic }) {
    return { map, mapPublic };
}
export default connect(ReactMapFun)(ReactMap);
