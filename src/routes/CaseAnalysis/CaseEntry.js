import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import styles from './CaseEntry.css';
import Mapbox from '../../components/Map/Mapbox/Mapbox';
import Slider from '../../components/Slider/Slider';
import UpData from '../../components/Updata/Updata';
import DataTab from '../../components/DataTab/DataTab'
import Model from '../../components/Model/Model';
import MapPublic from '../../components/Map/MapController/MapPublic'
import { apiService } from '../../services/config'
import { Button,Icon } from 'antd';
require('echarts');
require('@supermap/iclient-mapboxgl');
import EchartsLayer from '../../components/Map/MapLayer/ScatterPlotDemo'
class CaseEntry extends React.Component {

  constructor(props) {
    super(props);

  }
  componentDidMount() {
    let map = this.props.map.mapObj;
    this.props.map.mapObj.setStyle(this.props.map.style1);
    this.props.dispatch({
      type: 'mapPublic/setStyleValue',
      payload: ['白天']
    })
    map.on('load', () => {
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
              color: 'red',
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          zlevel: 1
        }]
      };
      var echartslayer = new EchartsLayer(map);
      this.props.dispatch({
        type: 'caseEntry/setEchartslayer',
        payload: echartslayer
      })
      echartslayer.add(option);
    })
  }
  //标点坐标的回调
  drawfun = (e) => {
    // console.log(e)
    // let dataCenter = this.props.caseEntry.dataCenter;
    // dataCenter.smx = e.features[0].geometry.coordinates[0];
    // dataCenter.smy = e.features[0].geometry.coordinates[1];
    // this.props.dispatch({
    //   type: 'caseEntry/setDataCenter',
    //   payload: dataCenter
    // })
    // this.props.dispatch({
    //   type: "caseEntry/setVisible",
    //   payload: true
    // })
  }
  onClickFun = () => {
    this.props.dispatch({
      type: 'caseEntry/setModel',
      payload: false
    })
    this.props.dispatch({
      type: 'caseEntry/setUpdata',
      payload: { data: '' }
    })
  }
  offClickFun = () => {
    this.props.dispatch({
      type: 'caseEntry/setModel',
      payload: true
    })
    this.props.dispatch({
      type: "caseEntry/setTabName",
      payload: ["已标注", "未标注"]
    })
  }
  render() {
    return (
      <div className={styles.mainIndex}>
        <Model />
        <div className={styles.but}>
          {this.props.caseEntry.model ?
            <Button shape="circle" icon="appstore-o" onClick={this.onClickFun} /> :
            <Button shape="circle" icon="appstore" onClick={this.offClickFun} />}
        </div>
        <div className={styles.updata}>
          <div className={styles.upload}>
            <UpData/>
          </div>
          <a href={apiService+'xk/case/exportCaseDemo'} className={styles.download}>
            <Button type="primary" >
              <Icon type="download" />下载模板
            </Button>
          </a>
        </div>
        <Mapbox />
        {this.props.caseEntry.model ? <div className={styles.tab}>
          <DataTab />
        </div>
          : ""}
        <div className={styles.rightTop}>
          <MapPublic />
        </div>
      </div>
    );
  }
}
function CaseEntryFun({ map, caseEntry }) {
  return { map, caseEntry };
}
export default connect(CaseEntryFun)(CaseEntry);
