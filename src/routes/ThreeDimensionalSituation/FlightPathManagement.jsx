import React from 'react';
import { connect } from 'dva';
import { Radio } from 'antd';
import styles from './FlightPathManagement.css';
import CesiumMap from '../../components/Map/Cesium/Cesium';
import FlightPathRadio from '../../components/Radio/FlightPathRadio';
import FligheModel from '../../components/Model/FlightModel';
import FlightTab from '../../components/DataTab/FlightTab';
// const RadioButton = Radio.Button;
// const RadioGroup = Radio.Group;
class FlightPathManagement extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let cesiumObj = this.props.cesium.cesiumObj;
    this.props.dispatch({ type: 'flightPathManagement/getVideoData' });
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
          for (let i in data.list) {
            if (data.list[i].indexes == name) {
              this.props.dispatch({
                type: 'flightPathManagement/setDataCenter',
                payload: data.list[i]
              })
              // this.props.dispatch({
              //   type: 'flightPathManagement/setFlightTabState',
              //   payload: true
              // })
              cesiumObj.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(data.list[i].smx, data.list[i].smy, 800),
                orientation: {
                  heading: Cesium.Math.toRadians(400),
                  pitch: Cesium.Math.toRadians(-90),
                  roll: 0.0
                }
              });
              if (!this.props.flightPathManagement.flightTabState) {
                if (viewshed3D) {
                  viewshed3D.viewPosition = [data.list[i].smx, data.list[i].smy, data.list[i].smh];
                  viewshed3D.distance = 150;
                  viewshed3D.horizontalFov = data.list[i].rangeAngle;
                  viewshed3D.verticalFov = data.list[i].rangeAngle;
                  viewshed3D.pitch = data.list[i].obliquity - 270;
                  viewshed3D.direction = data.list[i].azimuth;
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
        <CesiumMap />
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
function FlightPathManagementFun({ flightPathManagement, cesium }) {
  return { flightPathManagement, cesium };
}
export default connect(FlightPathManagementFun)(FlightPathManagement);
