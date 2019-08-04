import React from 'react';
import styles from './DataTab.css';
import { connect } from 'dva';
import { Tabs, Radio, Table, Icon, Divider } from 'antd';
class PavementAnalysisTab extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '定位',
      key: 'key',
      dataIndex: 'key',
      render: (text, record) => <Icon type="pushpin" style={{ fontSize: 16, color: '#08c', margin: "auto", cursor: "pointer" }} onClick={this.setPoint.bind(this, text, record)} />
    }, {
      title: '编号',
      key: 'smid',
      dataIndex: 'smid'
    }, {
      title: '名称',
      key: 'name',
      dataIndex: 'name'
    }, {
      title: '案件数',
      key: 'num',
      dataIndex: 'num'
    }];
    this.columns1 = [{
      title: '定位',
      key: 'key',
      dataIndex: 'key',
      render: (text, record) => <Icon type="pushpin" style={{ fontSize: 16, color: '#08c', margin: "auto", cursor: "pointer" }} onClick={this.setPoint.bind(this, text, record)} />
    }, {
      title: '编号',
      key: 'smid',
      dataIndex: 'smid'
    }, {
      title: '名称',
      key: 'name',
      dataIndex: 'name'
    }];
  }
  //编辑数据
  clickFun = (text, record) => {

  }
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
      console.log(features)
      mapObj.flyTo({
        center: [features.properties.SMSDRIE || features.properties.SMX || eatures.properties['经度'], features.properties.SMSDRIN || features.properties.SMY || atures.properties['纬度']],
        zoom: 16,
        speed: 0.2
      })
    }
  }
  //数据上图的回调
  setPoint = (text, record) => {
    let map = this.props.map.mapObj;
    this.props.dispatch({
      type: 'pavementAnalysis/setModelData',
      payload: record
    })
    this.props.dispatch({
      type: "pavementAnalysis/setDisabled",
      payload: true
    })
    this.props.dispatch({
      type: "pavementAnalysis/setButtonValue",
      payload: "编辑"
    })
    let upData = this.props.pavementAnalysis.upData;
    upData.smid = text;
    upData.formula = record.formula;
    let caseNumJson = '';
    if (record.list) {
      caseNumJson = '{'
      for (let i = 0; i < record.list.length; i++) {
        if (i == 0) {
          caseNumJson += '"' + record.list[i].smid + '":' + record.list[i].num + ''
        } else {
          caseNumJson += ',"' + record.list[i].smid + '":' + record.list[i].num + ''
        }
      }
      caseNumJson += '}'
    }
    upData.caseNumJson = caseNumJson;
    if (this.props.pavementAnalysis.mapLayer == 1) {
      this.clickFun(map, 'PavementMap', 'addPavementMap', text);
    } else if (this.props.pavementAnalysis.mapLayer == 2) {
      upData.type = 'line'
      this.props.dispatch({
        type: 'pavementAnalysis/setUpData',
        payload: upData
      })
      this.clickFun(map, 'SectionMap', 'addSectionMap', text);
    } else if (this.props.pavementAnalysis.mapLayer == 3) {
      upData.type = 'point'
      this.props.dispatch({
        type: 'pavementAnalysis/setUpData',
        payload: upData
      })
      this.clickFun(map, 'IntersectionMap', 'addIntersectionMap', text);
    } else {
      this.clickFun(map, 'CameraMapPoint', 'addCameraMapPoint', text);
    }
    this.props.dispatch({
      type: 'pavementAnalysis/setVisible',
      payload: true
    })
  }
  render() {
    return (
      <div>
        {this.props.pavementAnalysis.mapLayer == 4 ? <Table columns={this.columns1} pagination={false} bordered loading={this.props.pavementAnalysis.loading} dataSource={this.props.pavementAnalysis.columns} size='middle' /> : <Table columns={this.columns} pagination={false} bordered loading={this.props.pavementAnalysis.loading} dataSource={this.props.pavementAnalysis.columns} size='small' />}
      </div>
    )
  }
}
function pavementAnalysisTabModel({ pavementAnalysis, map }) {
  return { pavementAnalysis, map };
}
export default connect(pavementAnalysisTabModel)(PavementAnalysisTab);
