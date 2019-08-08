import React from 'react';
import { connect } from 'dva';
import { Radio } from 'antd';
import styles from './FlightPathManagement.css';
import FlightPathRadio from '../../components/Radio/FlightPathRadio';
import FligheModel from '../../components/Model/FlightModel';
import FlightTab from '../../components/DataTab/FlightTab';
import Mapbox from '../../components/Map/Mapbox/Mapbox';
import CameraMap from '../../components/Map/MapLayer/CameraMap';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class FlightManagement extends React.Component {
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
        //点击摄像头的交互
        mapObj.on('click', 'CameraMapPoint', this.clickFun.bind(this, mapObj, 'CameraMapPoint', 'addCameraMapPoint'));
    })
    this.props.dispatch({ 
      type: 'flightPathManagement/getVideoData',
      payload: mapObj 
    });

    // this.props.dispatch({
    //   type: 'map/getCameraPoint',
    //   payload: mapObj
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
      let list = this.props.flightPathManagement.smlibtileData;
      // let columns = this.props.pavementAnalysis.columns
      for (let i in list) {
          if (list[i].smid == features[0].properties.smid) {
            this.props.dispatch({
              type: 'flightPathManagement/setDataCenter',
              payload: list[i]
            })
            mapObj.flyTo({
              center: [list[i].smx, list[i].smy],
              zoom: 15,
              speed: 0.5
            })
            this.props.dispatch({
              type: 'flightPathManagement/setFlightTabState',
              payload: true
            })
              // this.props.dispatch({
              //     type: 'map/shutTimeOpen'
              // })
              // this.props.dispatch({
              //     type: 'map/setTimeState',
              //     payload: true
              // })
              // this.props.dispatch({
              //     type: 'pavementAnalysis/setSliderShow',
              //     payload: false
              // })
              // this.props.dispatch({
              //     type: 'pavementAnalysis/setModelData',
              //     payload: this.props.pavementAnalysis.columns[i]
              // })
              // this.props.dispatch({
              //     type: 'pavementAnalysis/setVisible',
              //     payload: true
              // })
              // this.props.dispatch({
              //     type: 'pavementAnalysis/setTabShow',
              //     payload: true
              // })
          }
      }
  }
  drawThreeMap() {
    let cesiumObj = this.props.cesium.cesiumObj;
    var scene = cesiumObj.scene;
    var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

    //设置鼠标左键单击回调事件
    handler.setInputAction((e) => {
      if (this.props.flightPathManagement.XYZData) {
        //获取点击位置笛卡尔坐标
        var position = scene.pickPosition(e.position);
        //将笛卡尔坐标转化为经纬度坐标
        var cartographic = Cesium.Cartographic.fromCartesian(position);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        var height = cartographic.height;
        if (height < 0) {
          height = 1;
        }
        if (longitude && latitude && height) {
          let dataCenter = {
            address: "",
            cameraCode: "",
            cameraType: "",
            cameraid: "",
            indexes: "",
            isControl: "",
            lightRelation: "",
            matrixNum: "",
            name: "",
            smTbName: '',
            smid: '',
            smlibtileid: '',
            smuserid: '',
            smx: '',
            smy: '',
            smz: '',
            videoType: ""
          }
          if (this.props.flightPathManagement.flightTab != 2) {
            dataCenter = this.props.flightPathManagement.dataCenter;
            this.props.dispatch({
              type: 'flightPathManagement/setDataCenter',
              payload: {
                ...dataCenter,
                ...{
                  smx: longitude,
                  smy: latitude,
                  smz: height
                }
              }
            })
          } else {
            this.props.dispatch({
              type: 'flightPathManagement/setDataCenter',
              payload: {
                ...dataCenter,
                ...{
                  smx: longitude,
                  smy: latitude,
                  smz: height
                }
              }
            })
            this.props.dispatch({
              type: 'flightPathManagement/setVisible',
              payload: true
            })
          }
          this.props.dispatch({
            type: 'flightPathManagement/setXYZData',
            payload: false
          })
          this.props.dispatch({
            type: 'flightPathManagement/setVisible',
            payload: true
          })
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    cesiumObj._selectedEntityChanged.addEventListener((entity, e) => {
      if (!this.props.flightPathManagement.XYZData) {
        let viewshed3D = this.props.flightPathManagement.viewshed3D;
        if (entity) {
          let name = entity['_name'];
          let data = this.props.flightPathManagement.smlibtileData;
          for (let i in data) {
            if (data[i].indexes == name) {
              this.props.dispatch({
                type: 'flightPathManagement/setDataCenter',
                payload: data[i]
              })
              // this.props.dispatch({
              //   type: 'flightPathManagement/setFlightTabState',
              //   payload: true
              // })
              cesiumObj.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(data[i].smx, data[i].smy, 800),
                orientation: {
                  heading: Cesium.Math.toRadians(400),
                  pitch: Cesium.Math.toRadians(-90),
                  roll: 0.0
                }
              });
              if (!this.props.flightPathManagement.flightTabState) {
                if (viewshed3D) {
                  viewshed3D.viewPosition = [data[i].smx, data[i].smy, data[i].smh];
                  viewshed3D.distance = 150;
                  viewshed3D.horizontalFov = data[i].rangeAngle;
                  viewshed3D.verticalFov = data[i].rangeAngle;
                  viewshed3D.pitch = data[i].obliquity - 270;
                  viewshed3D.direction = data[i].azimuth;
                  viewshed3D.build();
                }
              } else {
                if (viewshed3D) {
                  viewshed3D.distance = 0.01;
                  viewshed3D.build();
                }
              }
            }
          }
        } else {
          let cesiumObj = this.props.cesium.cesiumObj;
          cesiumObj.selectedEntity = '';
          if (viewshed3D) {
            viewshed3D.distance = 0.01;
          }
        }
      }
    })
  }
  render() {
    return (
      <div className={styles.mainIndex}>
        <Mapbox />
        <div className={styles.divTop}>
          <FlightPathRadio />
        </div>
        <FligheModel />
        {this.props.flightPathManagement.flightTabState ? <div className={styles.FlightTab}>
          <FlightTab />
        </div> : ''}
      </div>
    );
  }
}
function FlightManagementFun({ flightPathManagement, map, pavementAnalysis }) {
  return { flightPathManagement, map, pavementAnalysis };
}
export default connect(FlightManagementFun)(FlightManagement);
