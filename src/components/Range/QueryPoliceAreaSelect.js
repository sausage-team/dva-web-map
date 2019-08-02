import React from 'react';
import styles from './QueryAreaSelect.css';
import { connect } from 'dva';
import { Select,Card,AutoComplete,Divider,Switch} from 'antd';
import { valid } from '../../services/user';
import {fangKong} from '../../services/config';
const Option = Select.Option;
import Iframe from 'react-iframe';
import {bdpConfig} from '../../services/config';
class QueryPoliceAreaSelect extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    dataSource: [],
  }
  handleCqSqChange = (value) => {
    let datasets=fangKong.datasets;
    const {pcs,cqsq,selectData,mapType} =this.props.policeArea;
    let cqsqObj=cqsq.filter(item=>item.id==value);
    if(cqsqObj.length>0){
      let twoOptions=pcs.filter(item=>item.properties[datasets.level2.filedKeyArea]==cqsqObj[0].properties[datasets.level1.filedKeyName]);
      this.props.dispatch({
      type: 'policeArea/updateStateData',
       payload: {
        selectData:{
          oneOptions:cqsq,
          twoOptions:twoOptions
        },
        selGeometry:cqsqObj[0]
       }
      })
    }
    this.showViewFlag(false);
    //清除其它下拉框值

  }
  handlePcsChange = (value) => {
    this.pcsChange(value);
    let datasets=fangKong.datasets;
    const {pcs} =this.props.policeArea;
    let pcsObj=pcs.filter(item=>item.id==value);
    if(pcsObj.length>0){
      this.postMessageBDP(pcsObj[0].properties[datasets.level2.filedKeyName]);
    }
  }

  pcsChange=(value)=>{
    let datasets=fangKong.datasets;
    const {selectData,pcs,mapType} =this.props.policeArea;
    let pcsObj=pcs.filter(item=>item.id==value);
    if(pcsObj.length>0){
      this.props.dispatch({
        type: 'policeArea/updateStateData',
         payload: {
          selGeometry:pcsObj[0]
         }
        })
    if(mapType==1){//二维
      this.props.twoHightToMap(pcsObj[0]);
      }else{
        this.props.threeHightToMap(pcsObj[0]);
      }
    }
    this.showViewFlag(true);
  }

   //推送消息到BDP系统中
   postMessageBDP=(value)=>{
    let p={"type":"派出所查询","data":{"派出所名称":[value]}};
    document.getElementById('J_bridge').contentWindow.postMessage(p,bdpConfig);
  }
  getMessageBDP=(e)=>{
    if (e.data) {
      let datas=JSON.parse(e.data); 
      let name=datas.data['派出所名称'][0];
      if(name){
        this.onSelect(name)
      }
    }
  }
//初次渲染
componentDidMount() {
  this.props.dispatch({
    type: 'policeArea/updateStateData',
     payload: {
      handlePcsChange:this.handlePcsChange,
      handleCqSqChange:this.handleCqSqChange
     }
    })
    window.addEventListener('message',this.getMessageBDP, false);
}
  //销毁
componentWillUnmount(){
  let map=this.props.map.mapObj;
  let selGeometryObj=map.getSource('selGeometry');
    if(selGeometryObj!=null){
        map.removeLayer('selGeometry')
        map.removeSource('selGeometry')
    }
  this.showViewFlag(false);
}
  showViewFlag=(flag)=>{
    this.props.dispatch({
      type: 'policeArea/updateStateUi',
       payload: {
        sqFootModelView:flag,
       }
      })
  }

  handleSearch = (value) => {
    const {searchData} =this.props.policeArea;
    let datas=searchData.filter(item=>item.indexOf(value)>-1);
    this.setState({
      dataSource:datas,
    });
  }
  onSelect=(value)=>{
    let datasets=fangKong.datasets;
    const {pcs} =this.props.policeArea;
    let pcsArray=pcs.filter(item=>item.properties[datasets.level2.filedKeyName]==value);
    if(pcsArray.length>0){
      this.handlePcsChange(pcsArray[0].id)
    }
  }
  mapChange = (key) => {
    let maptype=this.props.policeArea.mapType;
     maptype=(key?2:1);
     this.props.dispatch({
      type: 'policeArea/updateStateData',
      payload: {
        mapType:maptype,
      }
    })
  }
  render() {
    let datasets=fangKong.datasets;
    const {dataSource} = this.state;
    // const {oneOptions,twoOptions} = this.props.policeArea.selectData;
    const oneOptions = this.props.policeArea.cqsq || [];
    const twoOptions = this.props.policeArea.pcs;
    const oneSelect = ''
    // debugger
    console.log('this.props.policeArea',this.props.policeArea)
    console.log('twoOptions',twoOptions)
    console.log('datasets.level2.filedKeyName',datasets.level2.filedKeyName)
    
    // const oneSelect=oneOptions.map(item=><Option key={item.id}>{item.properties[datasets.level1.filedKeyName]}</Option>);
    const twoSelect=twoOptions.map(item=><Option key={item.id}>{item.properties[datasets.level2.filedKeyName]}</Option>);
    return (
      <div className={styles.mainBox}>
       <Iframe id="J_bridge" url={bdpConfig} display="none"></Iframe>
        <div className={styles.title}><span>辖区查询</span>
          {/* <Switch checkedChildren="二维" unCheckedChildren="三维" className={styles.Switch} onChange={this.mapChange} /> */}
        </div>
        <Divider type="horizontal" className={styles.dividerline}/>
        <div>
          <AutoComplete
           dataSource={dataSource}
          className={styles.search}
        onSelect={this.onSelect}
        onSearch={this.handleSearch}
        placeholder="请输入您要检索的派出所名称"
         />
        </div>
        <div className={styles.areaBox}>
        <Select size="small" defaultValue="城区"  style={{ width:'35%',marginRight:10}} onChange={this.handleCqSqChange}>
          {oneSelect}
        </Select>
        <Select id='pcstext'  size="small" style={{ width:'60%'}} placeholder="-选择派出所-" onChange={this.handlePcsChange}>
          {twoSelect}
        </Select>
        </div>
     </div>
    )
  }
}
function mapFun({map,cesium,policeArea}) {
  return {map,cesium,policeArea};
}
export default connect(mapFun)(QueryPoliceAreaSelect);
