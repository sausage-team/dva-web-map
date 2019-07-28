import React from 'react';
import styles from './DataTab.css';
import { connect } from 'dva';
import { Tabs, Radio, Table, Icon, Divider } from 'antd';
import Draw from 'mapbox-gl-draw';
const TabPane = Tabs.TabPane;
class DataStatistics extends React.Component {
  constructor(props) {
    super(props);
    this.pagination = {
      pageSize: 6,
      hideOnSinglePage: true
    }
    this.columns2 = [{
      title: '案件编号',
      dataIndex: 'caseId',
      key: 'caseId',
      render: (text, record) => <a onClick={this.clickFun.bind(this, text, record)} >{text}</a>,
    }, {
      title: '案件状态',
      dataIndex: 'caseState',
      key: 'caseState',
    }, {
      title: '案件类别',
      dataIndex: 'caseType',
      key: 'caseType',
    }, {
      title: '发案时间',
      key: 'caseTime',
      dataIndex: 'caseTime',
    }, {
      title: '派出所管辖',
      key: 'ploiceArea',
      dataIndex: 'ploiceArea',
    }, {
      title: '案件详细地址',
      key: 'caseAddress',
      dataIndex: 'caseAddress',
    }, {
      title: '立案时间',
      key: 'recordTime',
      dataIndex: 'recordTime',
    }, {
      title: '定位',
      key: 'smid',
      dataIndex: 'smid',
      render: (text, record) => <Icon type="pushpin" style={{ fontSize: 16, color: '#08c', margin: "auto", cursor: "pointer" }} onClick={this.setPoint.bind(this, text, record)} />
    }];
  }
  //编辑数据
  clickFun = (text, record) => {
    this.props.dispatch({
      type: 'statistics/setDataCenter',
      payload: record
    })
    this.props.dispatch({
      type: "statistics/setVisible",
      payload: true
    })
  }

  //数据上图的回调
  setPoint = (text, record) => {
    let map = this.props.map.mapObj;
    let option = {
      GLMap: {},
      series: [{
        type: 'effectScatter',
        coordinateSystem: 'GLMap',
        data: [{ name: '', value: [record.smx, record.smy, 40] }],
        symbolSize: function (val) {
          return val[2] / 2;
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: 'red',
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        zlevel: 1
      }]
    };
    this.props.statistics.echartslayer.chart.setOption(option);
    map.flyTo({
      center: [record.smx, record.smy],
      zoom: 19,
      speed: 0.5
    })
  }
  render() {
    return (
      <Table columns={this.columns2} bordered dataSource={this.props.statistics.tabData} pagination={this.pagination} size='small' />
    )
  }
}
function dataTabModel({ statistics, map }) {
  return { statistics, map };
}
export default connect(dataTabModel)(DataStatistics);
