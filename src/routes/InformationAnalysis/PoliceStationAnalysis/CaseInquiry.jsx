import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import styles from './CaseInquiry.css';
import Mapbox from '../../../components/Map/Mapbox/Mapbox'
// import Slider from '../../../components/Slider/Slider'
import Statistics from '../../../components/Statistics/Statistics'
import { Button } from 'antd'
import DataStatistics from '../../../components/DataTab/DataStatistics'
import ModelStatistics from '../../../components/Model/ModelStatistics';
import MapPublic from '../../../components/Map/MapController/MapPublic'
require('echarts');
require('@supermap/iclient-mapboxgl');
import EchartsLayer from '../../../components/Map/MapLayer/ScatterPlotDemo';
import Iframe from 'react-iframe';
import {bdpConfig} from '../../../services/config';
class CaseInquiry extends React.Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.map.mapObj.setStyle(this.props.map.style1);
    let map = this.props.map.mapObj;
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
              color: '#f4e925',
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          zlevel: 1
        }]
      };
      var echartslayer = new EchartsLayer(map);
      this.props.dispatch({
        type: 'statistics/setEchartslayer',
        payload: echartslayer
      })
      echartslayer.add(option);
    })
    window.addEventListener('message',this.getMessageBDP, false);
  }
  getMessageBDP=(e)=>{
    if (e.data) {
      let datas=JSON.parse(e.data);
      datas=datas.data;
      let center={
        policeArea:datas['派出所'],
        countyName:datas['社区'],
        caseType:datas['案件类型'].length>0?datas['案件类型'][0]:[],//dan
        caseTypeMethod: datas['具体手段'],
        placeType:datas['发案部位类别'].length>0?datas['发案部位类别'][0]:[],//dan
        placeTypeDetail:datas['具体发案部位'],
        caseDateBegin:datas['最早发案日期'].length>0?datas['最早发案日期'][0]:[],//dan
        caseDateEnd:datas['最晚发案日期'].length>0?datas['最晚发案日期'][0]:[],
        timeStep:datas['案发时段'],
        mark: 'marked'
      }
      this.props.dispatch({
        type: 'statistics/setCenter',
        payload: center,
       })
       this.props.dispatch({
        type: 'statistics/getCase'
       })
    }
  }
  butClick = () => {
    let map = this.props.map.mapObj;
    this.props.dispatch({
      type: 'statistics/setCenter',
      payload: {...this.props.statistics.center,mark:'marked'}
    })
    this.props.dispatch({
      type: 'statistics/setStatisticsShow',
      payload: true
    })
    this.props.dispatch({
      type: 'statistics/setTabDataShow',
      payload: false
    })
    this.props.dispatch({
      type: 'statistics/setModel',
      payload: false
    })
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
    this.props.statistics.echartslayer.chart.setOption(option);
    map.flyTo({
      center: [114.3038583200, 30.6479700100],
      zoom: 10,
      speed: 0.5
    })
  }
  onClickFun = () => {
    let map = this.props.map.mapObj;
    this.props.dispatch({
      type: 'statistics/setTabDataShow',
      payload: false
    })
    this.props.dispatch({
      type: 'statistics/setModel',
      payload: false
    })
    let data = map.getSource('pointOne');
    data = data._data;
    data.features = []
    map.getSource('pointOne').setData(data);
    map.flyTo({
      center: [114.3038583200, 30.6479700100],
      zoom: 10,
      speed: 0.5
    })
  }
  render() {
    return (
      <div className={styles.mainIndex}>
<Iframe id="J_bridge" url={bdpConfig} display="none"></Iframe>
        <Mapbox />
        <Button className={styles.but} type="primary" onClick={this.butClick}>案件查询</Button>
        <ModelStatistics />
        {this.props.statistics.model ?
          <div className={styles.buto}>
            <Button shape="circle" icon="appstore-o" onClick={this.onClickFun} />
          </div>
          : ""}
        {this.props.statistics.StatisticsShow ? <div className={styles.statistics}>
          <Statistics />
        </div> : ""}
        {this.props.statistics.tabDataShow ? <div className={styles.tab}>
          <DataStatistics />
        </div>
          : ""}
        <div className={styles.rightTop}>
          <MapPublic />
        </div>
      </div>
    );
  }
}
function CaseInquiryFun({ map, statistics }) {
  return { map, statistics };
}
export default connect(CaseInquiryFun)(CaseInquiry);
