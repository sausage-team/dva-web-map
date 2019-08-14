import React from 'react';
import styles from './DataTab.css';
import { connect } from 'dva';
import { Tabs, Radio, Table, Icon, Divider } from 'antd';
import Draw from 'mapbox-gl-draw';
const TabPane = Tabs.TabPane;
class DataTab extends React.Component {
  constructor(props) {
    super(props);
    this.pagination = {
      pageSize: 6,
      pageSizeOptions: ['6'],
      hideOnSinglePage: true
    }
    this.columns = [{
      title: '案件编号',
      dataIndex: 'caseId',
      key: 'caseId',
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
      key: 'policeArea',
      dataIndex: 'policeArea',
    }, {
      title: '案件详细地址',
      key: 'caseAddress',
      dataIndex: 'caseAddress',
    }, {
      title: '立案时间',
      key: 'recordTime',
      dataIndex: 'recordTime',
    }];
    this.columns1 = [{
      title: '案件编号',
      dataIndex: 'caseId',
      key: 'caseId',
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
      key: 'policeArea',
      dataIndex: 'policeArea',
    }, {
      title: '案件详细地址',
      key: 'caseAddress',
      dataIndex: 'caseAddress',
    }, {
      title: '立案时间',
      key: 'recordTime',
      dataIndex: 'recordTime',
    }, {
      title: '失败原因',
      key: 'errorMark',
      dataIndex: 'errorMark',
    }];
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
      key: 'policeArea',
      dataIndex: 'policeArea',
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
    this.columns3 = [{
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
      key: 'policeArea',
      dataIndex: 'policeArea',
    }, {
      title: '案件详细地址',
      key: 'caseAddress',
      dataIndex: 'caseAddress',
    }, {
      title: '立案时间',
      key: 'recordTime',
      dataIndex: 'recordTime',
    }, {
      title: '标注',
      key: 'smid',
      dataIndex: 'smid',
      render: (text, record) => <Icon type="environment" style={{ fontSize: 16, color: '#08c', margin: "auto", cursor: "pointer" }} onClick={this.environment.bind(this, text, record)} />
    }];
  }
  //编辑数据
  clickFun = (text, record) => {
    this.props.dispatch({
      type: 'caseEntry/setDataCenter',
      payload: record
    })
    this.props.dispatch({
      type: "caseEntry/setVisible",
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
    this.props.caseEntry.echartslayer.chart.setOption(option);
    map.flyTo({
      center: [record.smx, record.smy],
      zoom: 16,
      speed: 0.5
    })
  }
  //标注的回调函数
  environment = (text, record) => {
    this.props.dispatch({
      type: 'caseEntry/setDataCenter',
      payload: record
    })
    let drawObj = this.props.map.drawObj
    drawObj.deleteAll();
    this.props.dispatch({
      type: 'mapPublic/setDrawState',
      payload: 'draw_point'
    })
    drawObj.changeMode('draw_point');
  }
  changeFun1 = (page) => {
    this.props.dispatch({
      type: "caseEntry/nomark",
      payload: page
    })
  }
  changeFun2 = (page) => {
    this.props.dispatch({
      type: "caseEntry/marked",
      payload: page
    })
  }
  rowFun = (record, index) => {
  }
  //切换tab页的回调函数
  tabFun = (key) => {
    let map = this.props.map.mapObj;
    if (!this.props.caseEntry.updata.data) {
      if (key == 1) {
        let drawObj = this.props.map.drawObj
        drawObj.deleteAll();
      } else if (key == 2) {
        let option = {
          GLMap: {},
          series: [{
            type: 'effectScatter',
            coordinateSystem: 'GLMap',
            data: [],
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
                color: '#f4e925',
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            zlevel: 1
          }]
        };
        this.props.caseEntry.echartslayer.chart.setOption(option);
        map.flyTo({
          center: [114.3038583200, 30.6479700100],
          zoom: 12,
          speed: 0.5
        })
      }
    }
  }
  render() {
    const pagination1 = {
      ...this.props.caseEntry.pagination1,
      onChange: this.changeFun1.bind(this)
    }
    const pagination2 = {
      ...this.props.caseEntry.pagination2,
      onChange: this.changeFun2.bind(this)
    }
    return (
      <Tabs
        defaultActiveKey="1"
        tabPosition={'left'}
        onChange={this.tabFun}
      >
        <TabPane tab={this.props.caseEntry.tabName[0]} key="1">
          {this.props.caseEntry.updata.data ?
            <Table columns={this.columns} bordered dataSource={this.props.caseEntry.okList} loading={this.props.caseEntry.loading} pagination={this.pagination} size='small' /> :
            <Table columns={this.columns2} bordered dataSource={this.props.caseEntry.mark} loading={this.props.caseEntry.loading} pagination={pagination1} size='small' />
          }
        </TabPane>
        <TabPane tab={this.props.caseEntry.tabName[1]} key="2">
          {this.props.caseEntry.updata.data ?
            <Table columns={this.columns1} bordered dataSource={this.props.caseEntry.errorList} loading={this.props.caseEntry.loading} pagination={this.pagination} size='small' /> :
            <Table columns={this.columns3} bordered dataSource={this.props.caseEntry.nomark} loading={this.props.caseEntry.loading} pagination={pagination2} size='small' />
          }
        </TabPane>
      </Tabs>
    )
  }
}
function dataTabModel({ caseEntry, map }) {
  return { caseEntry, map };
}
export default connect(dataTabModel)(DataTab);
