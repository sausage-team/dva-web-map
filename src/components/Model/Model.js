import React from 'react';
import styles from './Model.css';
import { connect } from 'dva';
import { Modal,Input,Radio} from 'antd';
const { TextArea } = Input;
const RadioGroup = Radio.Group;
class ModelComponent extends React.Component {
  constructor(props) {
    super(props);
    this.plainOptions=['男', '女', ]
  }
  handleOk = () => {
    this.props.dispatch({
      type:'caseEntry/caseUpData'
    })
    this.props.dispatch({
      type:'caseEntry/nomark'
    })
    this.props.dispatch({
      type:'caseEntry/marked'
    })
  }
  handleCancel = () => {
    let drawObj = this.props.map.drawObj
    drawObj.deleteAll();
    this.props.dispatch({
      type: 'caseEntry/setVisible',
      payload: false
    })
    this.props.dispatch({
      type: "caseEntry/setDataCenter",
      payload: " "
    })
  }
  handleInput =(value,e)=>{
    let dataCenter = this.props.caseEntry.dataCenter;
    dataCenter[value] = e.target.value
    this.props.dispatch({
      type: 'caseEntry/setDataCenter',
      payload: dataCenter
    })
  }
  render() {
    let menuConfigValue = this.props.caseEntry.dataCenter
    return (
      <Modal
        title="案件编辑"
        visible={this.props.caseEntry.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose={true}
        width={500}
        cancelText={"取消"}
        okText={"确定"}
      >
        <div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}><span style={{ color: 'red' }}>*</span>案件编号：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'caseId')} disabled={true} defaultValue={menuConfigValue.caseId} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>案件状态：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'caseState')} defaultValue={menuConfigValue.caseState} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>案件类别：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'caseType')} defaultValue={menuConfigValue.caseType} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>派出所管辖：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'ploiceArea')} defaultValue={menuConfigValue.ploiceArea} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>案发时间：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'caseTime')} defaultValue={menuConfigValue.caseTime} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>案发日期：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'caseTime')} defaultValue={menuConfigValue.caseDate} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>案件类型：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'typeName')} defaultValue={menuConfigValue.typeName} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>被害人年龄段：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'peopleAge')} defaultValue={menuConfigValue.peopleAge} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>被害人性别：</span>
            <RadioGroup style={{ width: '250px' }} options={this.plainOptions} onChange={this.handleInput.bind(this, 'peopleSex')} defaultValue={menuConfigValue.peopleSex} />
          </div>
          <div style={{ padding: '5px 0px', height: 60 }}>
              <span style={{ display: 'inline-block', width: '110px', textAlign: 'right', float: 'left' }}>案发详细地址：</span>
              <TextArea style={{ width: '250px', float: 'left', height: '50px' }} onChange={this.handleInput.bind(this, 'caseAddress')} defaultValue={menuConfigValue.caseAddress} ></TextArea>
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>立案时间：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'recordTime')} defaultValue={menuConfigValue.recordTime} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>实施手段：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'caseMethod')} defaultValue={menuConfigValue.caseMethod} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>选择处所：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'caseLocation')} defaultValue={menuConfigValue.caseLocation} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>涉嫌物品：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'caseGoods')} defaultValue={menuConfigValue.caseGoods} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>具体手段：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'detailedMethod')} defaultValue={menuConfigValue.detailedMethod} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>发案部位类别：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'placeType')} defaultValue={menuConfigValue.placeType} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>具体发案部位：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'countyName')} defaultValue={menuConfigValue.countyName} />
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>发案时段：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'timeStep')} defaultValue={menuConfigValue.timeStep} />
          </div>
          <div style={{ padding: '5px 0px', height: 80 }}>
              <span style={{ display: 'inline-block', width: '110px', textAlign: 'right', float: 'left' }}>简要案情：</span>
              <TextArea style={{ width: '250px', float: 'left', height: '70px' }} onChange={this.handleInput.bind(this, 'caseIntroduce')} defaultValue={menuConfigValue.caseIntroduce} ></TextArea>
          </div>
          <div style={{ padding: '5px 0px' }}>
            <span style={{ display: 'inline-block', width: '110px', textAlign: 'right' }}>录入时间：</span>
            <Input style={{ width: '250px' }} onChange={this.handleInput.bind(this, 'inputTime')} defaultValue={menuConfigValue.inputTime} />
          </div>
        </div>
      </Modal>
    )
  }
}
function ModelComponentFun({ caseEntry,map}) {
  return { caseEntry,map};
}
export default connect(ModelComponentFun)(ModelComponent);
