import React from 'react';
import styles from './Radio.css';
import { connect } from 'dva';
import { apiService } from '../../services/config'
import { Radio, Icon, Upload, message } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class FlightPathRadio extends React.Component {
    constructor(props) {
        super(props);
    }
    changeFun = (val) => {
        // let val = e.target.value;
        let cesiumObj = this.props.cesium.cesiumObj;
        if (val == 2) {
            this.props.dispatch({
                type: 'flightPathManagement/setXYZData',
                payload: true
            })
            this.props.dispatch({
                type: 'flightPathManagement/setFlightTab',
                payload: val
            })
            this.props.dispatch({
                type: 'flightPathManagement/setFlightTabState',
                payload: false
            })
            cesiumObj.trackedEntity = '';
        }
        if (val == 3) {
            this.props.dispatch({
                type: 'flightPathManagement/setFlightTabState',
                payload: true
            })

        }
        if (val == 5) {
            let scene = cesiumObj.scene;
            let dataCenter = this.props.flightPathManagement.dataCenter;
            let viewshed3D = this.props.flightPathManagement.viewshed3D;
            this.props.dispatch({
                type: 'flightPathManagement/setFlightTabState',
                payload: false
            })
            if (dataCenter.indexes && !viewshed3D) {
                scene.viewFlag = false;
                let viewshed3D = new Cesium.ViewShed3D(scene);
                let colorStr1 = viewshed3D.visibleAreaColor.toCssColorString();
                let colorStr2 = viewshed3D.hiddenAreaColor.toCssColorString();
                this.props.dispatch({
                    type: 'flightPathManagement/setViewshed3D',
                    payload: viewshed3D
                })
                this.props.dispatch({
                    type: 'flightPathManagement/setFlightTab',
                    payload: val
                })
                viewshed3D.viewPosition = [dataCenter.smx, dataCenter.smy, dataCenter.smh || 200];
                viewshed3D.build();
                //将标记置为false以激活鼠标移动回调里面的设置可视域操作
                scene.viewFlag = false;
                viewshed3D.distance = 150;
                viewshed3D.horizontalFov = dataCenter.rangeAngle;
                viewshed3D.verticalFov = dataCenter.rangeAngle;
                viewshed3D.pitch = dataCenter.obliquity - 270;
                viewshed3D.direction = dataCenter.azimuth;
            }else if(dataCenter.indexes && viewshed3D){
                let viewshed3D = this.props.flightPathManagement.viewshed3D;
                viewshed3D.distance = 150;
                viewshed3D.horizontalFov = dataCenter.rangeAngle;
                viewshed3D.verticalFov = dataCenter.rangeAngle;
                viewshed3D.pitch = dataCenter.obliquity - 270;
                viewshed3D.direction = dataCenter.azimuth;
                iewshed3D.build();
            }
        }
    }
    //控制是否添加完立即上传
    beforeUpload = (file, fileList, event) => {
        this.props.dispatch({
            type: 'flightPathManagement/setModel',
            payload: false
        })
        this.removeMissingdivCss()
        //校验当前上传的文件大小
        const type = ['xls'];
        let size = file.size
        let name = file.name.split('.');
        if (size / 1024 / 1024 <= 5) {

        } else {
            message.error(`${file.name}上传文件过大，请重新选择.`)
            return false
        }
        if (type.indexOf(name[1]) > -1) {

        } else {
            message.error(`${file.name} 数据格式不正确.`)
            return false
        }
    }
    //当上传数据发生变化时的回调函数
    upLoadCheng = (info) => {
        let response = info.file.response;
        const status = info.file.status;
        if (status === 'done') {
            if (info.file.response) {
                if (info.file.response.code!=0) {
                    message.error(`上传失败${info.file.response.data[0]}.`);
                    return;
                }else{
                  message.success(`上传成功`);
                }
            }
            this.props.dispatch({
                type: 'flightPathManagement/setModel',
                payload: true
            })
        } else if (status === 'error') {
            message.error(`上传失败，请重试.`);
        }
    }
    removeMissingdivCss = () => {
        const missingdiv = document.querySelector(".ant-upload-list-text");
        if (missingdiv) missingdiv.style.display = "none";
        const mapDOM = document.querySelector(".ant-upload-list");
        if (mapDOM) mapDOM.style.display = "none";
    }
    render() {
        return (
            // <RadioGroup size="default" onChange={this.changeFun}>
            <RadioGroup size="default" >
                <RadioButton value="1">
                   <div value="1" onClick={this.changeFun.bind(this,1)}>
                   <Upload {...this.props.flightPathManagement.updatastate} onChange={this.upLoadCheng} beforeUpload={this.beforeUpload} > <Icon type="upload" /> 摄像头上传</Upload>
                   </div>
                   
                </RadioButton>
                {/* <RadioButton value="2"><Icon type="swap" />添加</RadioButton> */}
                <RadioButton  value="3">
                  <span value="3" onClick={this.changeFun.bind(this,3)}>
                    <Icon type="fork" />查看
                  </span> 
                </RadioButton>
                {/* <RadioButton value="4"><Icon type="fork" />删除</RadioButton> */}
                {/* <RadioButton value="5"><Icon type="eye-o" />可视域分析</RadioButton> */}
                <RadioButton  value="5">
                  <a value="5" href={apiService+'xk/camera/download'}>
                    <Icon type="download" />下载模板
                  </a> 
                </RadioButton>
            </RadioGroup>
        );
    }
}
function FlightPathRadioModel({ flightPathManagement, cesium }) {
    return { flightPathManagement, cesium };
}
export default connect(FlightPathRadioModel)(FlightPathRadio);
