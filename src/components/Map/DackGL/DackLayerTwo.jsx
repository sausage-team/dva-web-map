import React from 'react';
import DeckGL, { HexagonLayer } from 'deck.gl';
import { connect } from 'dva';
import { pointToHexbin } from './hexagon-aggregator';

/**
 * 动态人口地图柱状图显示
 */
const LIGHT_SETTINGS = {
    lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
    ambientRatio: 0.4,
    diffuseRatio: 0.6,
    specularRatio: 0.2,
    lightsStrength: [1.5, 1.5, 1.5, 0.7],
    numberOfLights: 2
};
const elevationScale = { min: 1, max: 50 };

// const defaultProps = {
//     radius: 200,
//     upperPercentile: 100,
//     coverage: 1,
// };

class DackLayerTwo extends React.Component {
    static get defaultColorRange() {
        // return colorRange;
        return null
    }
    static get defaultViewport() {
        return {
            longitude: 116.29,
            latitude: 40.16,
            zoom: 7.82,
            minZoom: 11,
            maxZoom: 16,
            pitch: 40.5,
            radius: 42,
            //bearing: -27.396674584323023
            bearing: 0
        };
    }
    constructor(props) {
        super(props);
        this.startAnimationTimer = null;
        this.intervalTimer = null;
        this.state = {
            elevationScale: elevationScale.min
        };

        this._startAnimate = this._startAnimate.bind(this);
        this._animateHeight = this._animateHeight.bind(this);
    }
    //颜色十六进制转rgb
    colorRgb(color) {
        if (color.substring(0, 1) != "#") return this.toHex(color);
        const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        let sColor = color.toLowerCase();
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                let sColorNew = "#";
                for (let i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            let sColorChange = [];
            for (let i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return sColorChange.join(",");
        } else {
            return sColor;
        }
    }
    // add Histogramlayer  柱状图
    addHistogramLayer(data) {
        let colorTable = ["#038E3E", "#24FF00", "#FFFF00", "#FF7800", "#FF0000", "#76043C"]
        const newData = [];
        // const Data = this.getHistogramData(data);
        let Data = []
        for (let j in data) {
            if (data[j].n > 0) {
                for (let i = 0; i < data[j].n; i++) {
                    Data.push([data[j].x, data[j].y]);
                }
            }
        }
        let colorArr = [];
        for (let i = 0; i < colorTable.length; i++) {
            let color = this.colorRgb(colorTable[i]);
            colorArr.push(color.split(","));
        }
        newData.push(Data);
        newData.push(colorArr);
        this.props.dispatch({
            type: 'map/setDackList',
            payload: newData
        })
    }
    // 柱状图数据处理
    getHistogramData(data) {
        data = data.data;
        let endarr = [];
        for (let key in data) {
            // for (let j in data[key]) {
            //   let LonLat = this.toLonLat(data[key][j].wgx,data[key][j].wgy,data[key][j].level);
            //   endarr.push(LonLat);
            // }
            let LonLat = this.toLonLat(data[key][0].wgx, data[key][0].wgy, data[key][0].level);
            endarr.push(LonLat);
        }
        return endarr;
    }
    //经纬度转换
    toLonLat(lon, lat, weight) {
        var arrend = [];
        var zoom = 14;
        lon = parseFloat(lon);
        lat = parseFloat(lat)
        var lon_min = lon / Math.pow(2, zoom) * 360 - 180;
        var lon_max = (lon + 1) / Math.pow(2, zoom) * 360 - 180;
        var lat_min = Math.atan(Math.sinh(Math.PI * (1 - ((lat - 1) / Math.pow(2, zoom - 1))))) * 180 / Math.PI;
        var lat_max = Math.atan(Math.sinh(Math.PI * (1 - (lat / Math.pow(2, zoom - 1))))) * 180 / Math.PI;
        arrend = [(lon_min + lon_max) / 2, (lat_min + lat_max) / 2, weight];

        return arrend
    }
    //初次渲染
    componentDidMount() {
        this._animate();
        this.addHistogramLayer(this.props.map.dackData);
        // this.props.dispatch({
        //    type:'map/getDackData'
        // })
    }
    // componentWillReceiveProps(nextProps) {
    //   if (nextProps.data.length !== this.props.map.dackList[0].length) {
    //     this._animate();
    //   }
    // }
    componentWillUnmount() {
        this._stopAnimate();
    }

    _animate() {
        this._stopAnimate();

        // wait 1.5 secs to start animation so that all data are loaded
        this.startAnimationTimer = window.setTimeout(this._startAnimate, 1500);
    }

    _startAnimate() {
        this.intervalTimer = window.setInterval(this._animateHeight, 20);
    }

    _stopAnimate() {
        window.clearTimeout(this.startAnimationTimer);
        window.clearTimeout(this.intervalTimer);
    }

    _animateHeight() {
        if (this.state.elevationScale === elevationScale.max) {
            this._stopAnimate();
        } else {
            this.setState({ elevationScale: this.state.elevationScale + 1 });
        }
    }

    _initialize(gl) {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    }

    render() {
        const { viewport, dackList } = this.props.map;
        if (!dackList) {
            return null;
        }
        const layers = [
            new HexagonLayer({
                id: 'hexagon-layer',      //  Canvas ID允许CSS中的样式定制。
                // colorRange: [
                //   [1, 152, 189],
                //   [73, 227, 206],
                //   [216, 254, 181],
                //   [254, 237, 177],
                //   [254, 173, 84],
                //   [209, 55, 78]
                // ],
                colorRange: dackList[1],
                coverage: 0.7,
                data: dackList[0],
                elevationRange: [0, 200],
                elevationScale: this.state.elevationScale,
                extruded: true,
                getPosition: d => d,
                lightSettings: LIGHT_SETTINGS,
                onHover: this.props.onHover,
                opacity: 0.9,
                pickable: Boolean(this.props.onHover),
                radius: 200,
                upperPercentile: 100,
                hexagonAggregator: pointToHexbin
            }),
        ];
        return <DeckGL {...viewport} layers={layers} onWebGLInitialized={this._initialize} />;
    }
}
function ReactMapFun(map) {
    return map;
}
export default connect(ReactMapFun)(DackLayerTwo);
