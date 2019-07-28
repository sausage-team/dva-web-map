import React from 'react';
import styles from './Model.css'
import { connect } from 'dva';
import { Modal,Input,Radio,Table,Button} from 'antd';
class PavementModel extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '编号',
      key: 'smid',
      dataIndex: 'smid'
    },{
      title: '名称',
      key: 'name',
      dataIndex: 'name'
    },{
      title: '案件数',
      key: 'num',
      dataIndex: 'num'
    }];
  }
  handleCancel=()=>{
      this.props.dispatch({
          type:'pavementAnalysis/setVisible',
          payload:false
      })
  }
  clickFun=(e)=>{
    if(this.props.pavementAnalysis.buttonValue=="编辑"){
      this.props.dispatch({
        type:"pavementAnalysis/setDisabled",
        payload:false
      })
      this.props.dispatch({
        type:"pavementAnalysis/setButtonValue",
        payload:"保存"
      })
    }else{
      this.props.dispatch({
        type:"pavementAnalysis/setDisabled",
        payload:true
      })
      this.props.dispatch({
        type:"pavementAnalysis/setUp"
      })
      this.props.dispatch({
        type:"pavementAnalysis/setButtonValue",
        payload:"编辑"
      })
    }
  }
  handleInput =(value,e)=>{
    let upData = this.props.pavementAnalysis.upData;
    upData[value] = e.target.value;
    this.props.dispatch({
      type: 'pavementAnalysis/setUpData',
      payload: upData
    })
  }
  render() {
    const modelData = this.props.pavementAnalysis.modelData;
    return (
      <Modal
        title="路面基本信息"
        visible={this.props.pavementAnalysis.visible}
        onCancel={this.handleCancel}
        destroyOnClose={true}
        width={400}
        footer={null}
        mask={false}
        maskClosable={false}
        getContainer={() =>document.getElementById('model')}
        wrapClassName={styles.model}
        style={{top:0}}
      >
        <div>
          <div style={{ padding: '3px 0px' }}>
            <span style={{ display: 'inline-block', width: '90px', textAlign: 'right' }}>编&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</span>
            <span style={{ display: 'inline-block',width: '190px',textAlign:'center'}} >{modelData.smid}</span>
          </div>
          <div style={{ padding: '3px 0px' }}>
            <span style={{ display: 'inline-block', width: '90px', textAlign: 'right' }}>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：</span>
            <span style={{ display: 'inline-block',width: '190px',textAlign:'center'}} >{modelData.name}</span>
          </div>
          {modelData.num?<div style={{ padding: '3px 0px' }}>
            <span style={{ display: 'inline-block', width: '90px', textAlign: 'right' }}>案件数量：</span>
            <span style={{ display: 'inline-block',width: '190px',textAlign:'center'}} >{modelData.num}</span>
          </div>:""}
          {modelData.cameraid?<div style={{ padding: '3px 0px' }}>
            <span style={{ display: 'inline-block', width: '90px', textAlign: 'right' }}>矩阵编号：</span>
            <span style={{ display: 'inline-block',width: '190px',textAlign:'center'}} >{modelData.cameraid}</span>
          </div>:""}
          {modelData.smx?<div style={{ padding: '3px 0px' }}>
            <span style={{ display: 'inline-block', width: '90px', textAlign: 'right' }}>经&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：</span>
            <span style={{ display: 'inline-block',width: '190px',textAlign:'center'}} >{modelData.smx}</span>
          </div>:""}
          {modelData.smy?<div style={{ padding: '3px 0px' }}>
            <span style={{ display: 'inline-block', width: '90px', textAlign: 'right' }}>纬&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：</span>
            <span style={{ display: 'inline-block',width: '190px',textAlign:'center'}} >{modelData.smy}</span>
          </div>:""}
          {modelData.isborder?
          <div style={{ padding: '3px 0px' }}>
            <span style={{ display: 'inline-block', width: '90px', textAlign: 'right' }}>是否是边界：</span>
            <span style={{ display: 'inline-block',width: '190px',textAlign:'center'}} >{modelData.isborder}</span>
          </div>:""}
          {modelData.list?
          <div>
            {modelData.list[0]?<div style={{ padding: '3px 0px' }}>
              <span style={{ display: 'inline-block', width: '90px', textAlign: 'right' }}>计算公式：</span>
              <Input style={{ width: '170px' }} onChange={this.handleInput.bind(this, 'formula')}  disabled={this.props.pavementAnalysis.disabled} value={this.props.pavementAnalysis.upData.formula} placeholder={"请输入公式！"} /><Button onClick={this.clickFun} type="primary" style={{'marginLeft':'5px'}}>{this.props.pavementAnalysis.buttonValue}</Button>
            </div>:""}
          </div>:""}
          {modelData.list?
          <div style={{ padding: '3px 0px' }}>
              <Table columns={this.columns} pagination={false} bordered dataSource={modelData.list} size='middle'/>
          </div>:""}
        </div>
      </Modal>
    )
  }
}
function PavementModelFun({ pavementAnalysis,map}) {
  return { pavementAnalysis,map};
}
export default connect(PavementModelFun)(PavementModel);
