import React from 'react';
import styles from './Mapbox.css';
import mapboxgl from 'mapbox-gl';
import draw from 'mapbox-gl-draw';
import { connect } from 'dva';
// import { Logo, QueryByBoundsParameters, QueryService } from ;
require('@supermap/iclient-mapboxgl');
class Mapbox extends React.Component {
  constructor(props) {
    super(props);
  }
  //初次渲染
  componentDidMount() {
    mapboxgl.accessToken = this.props.map.accessToken;
    let map = new mapboxgl.Map(this.props.map.mapstate);
    this.props.dispatch({
      type: 'map/setMapObj',
      payload: map
    })
    this.setTime();
    // map.addControl(new Logo(), 'bottom-right');
    // map.addControl(new mapboxgl.NavigationControl()); //增加一个地图空间
    // //地图全屏的插件
    // map.addControl(new mapboxgl.FullscreenControl());
    let Draw = new draw()
    map.addControl(Draw, 'top-right');
    this.props.dispatch({
      type: 'map/setDrawObj',
      payload: Draw
    })
    //地图初始化的时候进行图层判断加载删除
    map.on('load', () => {
      map.flyTo({
        center: [114.3038583200, 30.6479700100],
        zoom: 12,
        speed: 0.2
      })
    })
    map.on('styledata', () => {
      if (this.props.mapPublic.styleValue[0] == '卫星') {
        // let mapValue = this.props.mapPublic.mapValue;
        // for (let i in mapValue) {
        //   switch (mapValue[i]) {
        //     case '城区山区':
        //       var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
        //         queryParameter: {
        //           name: "城区山区"
        //         },
        //         datasetNames: ['data:城区山区']
        //       });
        //       let service = new mapboxgl.supermap.FeatureService(this.dataUrl);
        //       service.getFeaturesBySQL(sqlParam, (serviceResult) => {
        //         console.log(serviceResult)
        //       })
        //       break;
        //     case '派出所辖区':
        //       map.setLayoutProperty('派出所辖区@data_outline', 'visibility', 'visible');
        //       map.setLayoutProperty('派出所辖区@data#1', 'visibility', 'visible');
        //       break;
        //     case '社区面':
        //       map.setLayoutProperty('网格面@data_outline_0', 'visibility', 'visible');
        //       map.setLayoutProperty('网格面@data#1', 'visibility', 'visible');
        //       break;
        //     default:
        //       break;
        //   }
        // }
        return;
      }
      // map.setLayoutProperty('城区山区@data#1_山区_outline', 'visibility', 'none');
      // map.setLayoutProperty('城区山区@data#1_城区_outline', 'visibility', 'none');
      // map.setLayoutProperty('派出所辖区@data_outline', 'visibility', 'none');
      // map.setLayoutProperty('派出所辖区@data#1', 'visibility', 'none');
      // map.setLayoutProperty('网格面@data_outline_0', 'visibility', 'none');
      // map.setLayoutProperty('网格面@data#1', 'visibility', 'none');
      let mapValue = this.props.mapPublic.mapValue;
      for (let i in mapValue) {
        switch (mapValue[i]) {
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
    })
    this.removeMissingdivCss();
  }
  //二次渲染
  componentDidUpdate() {
    setTimeout(() => {
      if (this.props.map.mapObj) {
        this.props.map.mapObj.resize();
      }
    }, 185)
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
      this.props.dispatch({
        type: 'map/pavementMapOpen'
      })
      this.props.dispatch({
        type: 'map/sectionMapOpen'
      })
      this.props.dispatch({
        type: 'map/intersectionMapOpen'
      })
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
  //隐藏CSS
  removeMissingdivCss = () => {
    const missingdiv = document.querySelector(".mapboxgl-missing-css");
    if (missingdiv) missingdiv.style.display = "none";
    const mapDOM = document.querySelector(".mapboxgl-ctrl-logo");
    if (mapDOM) mapDOM.style.display = "none";
    const draw = document.querySelector(".mapboxgl-ctrl");
    if (draw) draw.style.display = "none";
  }
  render() {
    return (
      <div id="map" className={styles.mapbox} >
      </div>
    )
  }
}
function mapFun(map) {
  return map;
}
export default connect(mapFun)(Mapbox);
