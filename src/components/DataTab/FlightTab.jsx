import React from 'react';
import styles from './DataTab.css';
import { connect } from 'dva';
import { Tabs, Radio, Table, Icon, Divider,Input,Button } from 'antd';
class FlightTab extends React.Component {
  constructor(props) {
    super(props);
  }
  handleInput =(value,e)=>{
    let dataCenter = this.props.flightPathManagement.dataCenter;
    dataCenter[value] = e.target.value
    this.props.dispatch({
      type: 'flightPathManagement/setDataCenter',
      payload: dataCenter
    })
  }
  delatClick=()=>{
    let cesiumObj = this.props.cesium.cesiumObj;
    if(cesiumObj.selectedEntity){
      this.props.dispatch({
          type:'flightPathManagement/delet',
          payload:cesiumObj.selectedEntity['_name']
      })
      this.props.dispatch({
        type:'flightPathManagement/setFlightTab',
        payload:false
      })
      cesiumObj.selectedEntity = ''
    }
  }
  upClick=()=>{
    this.props.dispatch({
      type:'flightPathManagement/setVisible',
      payload:true
    })
  }
  XYZClick=()=>{
    this.props.dispatch({
      type:'flightPathManagement/setXYZData',
      payload:true
    })
  }
  render() {
    let menuConfigValue = this.props.flightPathManagement.dataCenter;
    return (
      <div>
        <div style={{ padding: '0px 0px' }}>
          <h2 style={{ textAlign: 'center',lineHeight:'32px',fontSize:'16px',margin:'0'}}>摄像头基本属性</h2>
        </div>
      <div style={{ padding: '5px 0px' }}>
        <span style={{ display: 'inline-block', width: '90px', textAlign: 'right' }}>摄像头索引：</span>
        <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'indexes')} disabled={true} value={this.props.flightPathManagement.dataCenter.indexes} />
      </div>
      <div style={{ padding: '5px 0px' }}>
        <span style={{ display: 'inline-block', width: '90px', textAlign: 'right' }}>名称：</span>
        <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'name')} disabled={true} value={this.props.flightPathManagement.dataCenter.name} />
      </div>
      <div style={{ padding: '5px 0px' }}>
        <span style={{ display: 'inline-block', width: '90px', textAlign: 'right' }}>摄像头类别：</span>
        <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'cameraType')} disabled={true} value={this.props.flightPathManagement.dataCenter.cameraType} />
      </div>
      <div style={{ padding: '5px 0px' }}>
        <span style={{ display: 'inline-block', width: '90px', textAlign: 'right' }}>视频类别：</span>
        <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'videoType')} disabled={true} value={this.props.flightPathManagement.dataCenter.videoType} />
      </div>
      <div style={{ padding: '5px 0px' }}>
          <span style={{ display: 'inline-block', width: '90px', textAlign: 'right' }}>摄像头地址：</span>
          <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'address')} disabled={true} value={this.props.flightPathManagement.dataCenter.address} />
      </div>
      <div style={{ padding: '5px 0px' }}>
        <span style={{ display: 'inline-block', width: '90px', textAlign: 'right' }}>X,Y轴坐标：</span>
        <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'smxyz')} disabled={true} value={this.props.flightPathManagement.dataCenter.smx+","+this.props.flightPathManagement.dataCenter.smy+""} />
      </div>
      <div style={{ padding: '5px 0px' }}>
        <span style={{ display: 'inline-block', width: '90px', textAlign: 'right' }}>高度：</span>
        <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'smh')} disabled={true} value={this.props.flightPathManagement.dataCenter.smh} />
      </div>
      <div style={{ padding: '5px 0px',textAlign:'center' }}>
        <Button type="primary" onClick={this.XYZClick}>更改位置</Button>
        <Button  style={{ margin: '0px 10px' }} type="primary" onClick={this.upClick}>编辑</Button>
        <Button type="primary" onClick={this.delatClick}>删除</Button>
      </div>
    </div>
    )
  }
}
function FlightTabFun({ flightPathManagement,cesium}) {
  return { flightPathManagement,cesium};
}
export default connect(FlightTabFun)(FlightTab);
