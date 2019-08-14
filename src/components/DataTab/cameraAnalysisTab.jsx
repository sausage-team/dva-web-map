import React from 'react';
import styles from './DataTab.css';
import { connect } from 'dva';
import { Tabs, Radio, Table, Icon, Divider } from 'antd';
class cameraAnalysisTab extends React.Component {
  constructor(props) {
    super(props);
    this.pagination = {
      pageSize: 4,
      pageSizeOptions: [4],
      hideOnSinglePage: true
    }
    this.columns = [{
      title: '定位',
      key: 'key',
      dataIndex: 'key',
      render: (text, record) => <Icon type="pushpin" style={{ fontSize: 16, color: '#08c', margin: "auto", cursor: "pointer" }} onClick={this.setPoint.bind(this, text, record)} />
    }, {
      //   title: '编号',
      //   key: 'smid',
      //   dataIndex: 'smid'
      // }, {
      title: '名称',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: '案件总数',
      key: 'caseNum',
      dataIndex: 'caseNum'
    },
    {
      title: '高发时段',
      key: 'caseString',
      dataIndex: 'caseString'
    }, 
    {
      title: '高发时段案件数',
      key: 'Num',
      dataIndex: 'Num'
    }];
  }
  //编辑数据
  //   clickFun = (text, record) => {

  //   }
  clickFun = (mapObj, getLayers, setLayers, text, e) => {
    let features = mapObj.getSource(getLayers);
    if (features) {
      let obj = {};
      for (let i in features._data.features) {
        if (features._data.features[i].properties.ID == text) {
          features = features._data.features[i];
          break;
        }
      }
      obj = {
        'type': 'Feature',
        'properties': features.properties,
        'geometry': features.geometry
      }
      let data = mapObj.getSource(setLayers);
      data = data._data;
      data.features = [obj];
      mapObj.getSource(setLayers).setData(data);
      if (this.props.cameraAnalysis.mapStart == 'a') {
        mapObj.flyTo({
          center: [features.properties.SMX, features.properties.SMY],
          zoom: 14,
          speed: 0.3,
          pitch: 60
        })
      } else if (this.props.cameraAnalysis.mapStart == 'b') {
        mapObj.flyTo({
          center: [features.properties.SMX, features.properties.SMY],
          zoom: 16,
          speed: 0.3,
          pitch: 0
        })
      }
    }
  }
  //数据上图的回调
  setPoint = (text, record) => {
    let map = this.props.map.mapObj;
    // let upData = this.props.cameraAnalysis.upData;
    // upData.smid = text;
    // upData.formula= record.formula;
    // let caseNumJson = '';
    // if(record.list){
    //   caseNumJson = '{'
    //   for(let i=0;i<record.list.length;i++){
    //     if(i==0){
    //       caseNumJson += '"'+record.list[i].smid+'":'+record.list[i].num+''
    //     }else{
    //       caseNumJson += ',"'+record.list[i].smid+'":'+record.list[i].num+''
    //     }
    //   }
    //   caseNumJson+='}'
    // }
    // upData.caseNumJson=caseNumJson;
    if (this.props.cameraAnalysis.mapStart == 'a') {
      this.clickFun(map, 'TSMap', 'addTSMap', text);
    } else if (this.props.cameraAnalysis.mapStart == 'b') {
      // upData.type = 'line'
      // this.props.dispatch({
      //   type: 'cameraAnalysis/setUpData',
      //   payload: upData
      // })
      this.clickFun(map, 'TSHotMapPoint', 'addTSHotMapPoint', text);
    }
    this.props.dispatch({
      type: 'cameraAnalysis/setVisible',
      payload: true
    })
  }
  render() {
    return (
      <Table bordered
        size='small'
        columns={this.columns}
        loading={this.props.cameraAnalysis.loading}
        dataSource={this.props.cameraAnalysis.columns} 
        pagination={this.pagination}/>
    )
  }
}
function cameraAnalysisTabModel({ cameraAnalysis, map }) {
  return { cameraAnalysis, map };
}
export default connect(cameraAnalysisTabModel)(cameraAnalysisTab);
