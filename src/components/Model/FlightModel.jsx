import React from 'react';
// import styles from './Model.css';
import { connect } from 'dva';
import { Modal,Input } from 'antd';
const { TextArea } = Input;
// const RadioGroup = Radio.Group;
class FlightModel extends React.Component {
  constructor(props) {
    super(props);
    this.plainOptions=['是', '否']
  }
  handleOk = () => {
    let dataCenter = this.props.flightPathManagement.dataCenter;
    this.props.dispatch({
      type:'flightPathManagement/setUp',
      payload:dataCenter
    })
  }
  handleCancel = () => {
    this.props.dispatch({
      type: 'flightPathManagement/setVisible',
      payload: false
    })
  }
  handleInput =(value,e)=>{
    let dataCenter = this.props.flightPathManagement.dataCenter;
    dataCenter[value] = e.target.value
    this.props.dispatch({
      type: 'flightPathManagement/setDataCenter',
      payload: dataCenter
    })
  }
  render() {
    let menuConfigValue = this.props.flightPathManagement.dataCenter
    return (
      <Modal
        title="摄像头编辑"
        visible={this.props.flightPathManagement.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose={true}
        width={500}
        cancelText={"取消"}
        okText={"确定"}>
        <div>
          {this.props.flightPathManagement.dataCenter.cameraid?<div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}><span style={{ color: 'red' }}>*</span>摄像头索引：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'cameraId')} disabled={true} defaultValue={menuConfigValue.cameraId} />
          </div>:''}
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>名称：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'name')} defaultValue={menuConfigValue.name} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>设备编号：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'deviceNo')} defaultValue={menuConfigValue.deviceNo} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>所属区域：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'district')} defaultValue={menuConfigValue.district} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>设备IP：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'ip')} defaultValue={menuConfigValue.ip} />
          </div>
          {/* <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>摄像头类别：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'cameraType')} defaultValue={menuConfigValue.cameraType} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>视频类别：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'videoType')} defaultValue={menuConfigValue.videoType} />
          </div> */}
          {/* <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>头杆关系：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'lightRelation')} defaultValue={menuConfigValue.lightRelation} />
          </div> */}
          {/* <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>摄像头编码：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'cameraCode')} defaultValue={menuConfigValue.cameraCode} />
          </div> */}
          {/* <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>是否可控：</span>
            <RadioGroup style={{ width: '250px' }} options={this.plainOptions} onChange={this.handleInput.bind(this, 'isControl')} defaultValue={menuConfigValue.isControl} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>本单位矩阵：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'matrixNum')} defaultValue={menuConfigValue.matrixNum} />
          </div> */}
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>X轴坐标：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'smx')} defaultValue={menuConfigValue.smx} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>Y轴坐标：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'smy')} defaultValue={menuConfigValue.smy} />
          </div>
          {/* <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>高度：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'smh')} defaultValue={menuConfigValue.smh} />
          </div> */}
          {/* <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>旋转角度：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'angle')} defaultValue={menuConfigValue.angle} />
          </div> */}
          <div style={{ padding: '5px 0px', height: 60 }}>
              <span style={{ display: 'inline-block', width: '110px', textAlign: 'right', float: 'left' }}>摄像头地址：</span>
              <TextArea style={{ width: '250px', float: 'left', height: '50px' }} onChange={this.handleInput.bind(this, 'address')} defaultValue={menuConfigValue.address} ></TextArea>
          </div>
        </div>
      </Modal>
    )
  }
}
function FlightModelFun({ flightPathManagement,cesium}) {
  return { flightPathManagement,cesium};
}
export default connect(FlightModelFun)(FlightModel);
