import React from 'react';
import styles from './Statistics.css';
import { connect } from 'dva';
import { Slider, Button, Checkbox, DatePicker, Switch } from 'antd';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;
import Iframe from 'react-iframe';
import {bdpConfig} from '../../services/config';
class Statistics extends React.Component {
    constructor(props) {
        super(props);
    }
    checkCheng = (text, checkedValues) => {
        let countyList = [];
        for (let j in checkedValues) {
            for (let i in this.props.statistics.county) {
                if (checkedValues[j] == this.props.statistics.county[i].police) {
                    let obj = { label: this.props.statistics.county[i].countyName, value: this.props.statistics.county[i].countyName }
                    countyList.push(obj);
                }
            }
        }
        this.props.dispatch({
            type: 'statistics/setCountyList',
            payload: countyList,
        })
        let center = this.props.statistics.center;
        center[text] = checkedValues;
        this.props.dispatch({
            type: 'statistics/setCenter',
            payload: center,
        })
    }
    checkCheng1 = (text, checkedValues) => {
        let center = this.props.statistics.center;
        // if(text == 'countyName'){
        //     center[text]=checkedValues.toString();
        // }else{
        //     let obj = [];
        //     for(let i in checkedValues){
        //         for(let j in this.props.statistics[text]){
        //             if(checkedValues[i] == this.props.statistics[text][j].parentId){
        //                 alert(1)
        //                 obj.push(this.props.statistics[text][j].name)
        //             }
        //         }
        //     }
        //     center[text]=obj.toString();
        // }
        if(text == 'mark'){
          center[text] = checkedValues? "maked" : "nomark"
        }else{
          center[text] = checkedValues
        }
        this.props.dispatch({
            type: 'statistics/setCenter',
            payload: center,
        })

    }
    checkCheng2 = (text, checkedValues) => {
        let center = this.props.statistics.center;
        if (checkedValues.length == 1 || checkedValues.length == 0) {
            this.props.dispatch({
                type: 'statistics/setCheckCaseType',
                payload: checkedValues
            })
        } else {
            checkedValues = [checkedValues[1]]
            this.props.dispatch({
                type: 'statistics/setCheckCaseType',
                payload: checkedValues
            })
        }
        let caseTypeMethodList = [];
        for (let j in checkedValues) {
            for (let i in this.props.statistics.caseTypeMethod) {
                if (checkedValues[j] == this.props.statistics.caseTypeMethod[i].parentId) {
                    let obj = { label: this.props.statistics.caseTypeMethod[i].name, value: this.props.statistics.caseTypeMethod[i].name }
                    caseTypeMethodList.push(obj);
                }
            }
        }
        let obj = [];
        for (let i in checkedValues) {
            for (let j in this.props.statistics.caseType) {
                if (checkedValues[i] == this.props.statistics.caseType[j].value) {
                    obj.push(this.props.statistics.caseType[j].label)
                }
            }
        }
        center.caseTypeMethod = "";
        center[text] = obj.toString();
        this.props.dispatch({
            type: 'statistics/setCenter',
            payload: center,
        })
        this.props.dispatch({
            type: 'statistics/setCaseTypeMethodList',
            payload: caseTypeMethodList,
        })

    }
    checkCheng3 = (text, checkedValues) => {
        let center = this.props.statistics.center;
        if (checkedValues.length == 1 || checkedValues.length == 0) {
            this.props.dispatch({
                type: 'statistics/setCheckPlaceType',
                payload: checkedValues
            })
        } else {
            checkedValues = [checkedValues[1]]
            this.props.dispatch({
                type: 'statistics/setCheckPlaceType',
                payload: checkedValues
            })
        }
        let placeTypeDetailList = [];
        for (let j in checkedValues) {
            for (let i in this.props.statistics.placeTypeDetail) {
                if (checkedValues[j] == this.props.statistics.placeTypeDetail[i].parentId) {
                    let obj = { label: this.props.statistics.placeTypeDetail[i].name, value: this.props.statistics.placeTypeDetail[i].name }
                    placeTypeDetailList.push(obj);
                }
            }
        }
        let obj = [];
        for (let i in checkedValues) {
            for (let j in this.props.statistics.placeType) {
                if (checkedValues[i] == this.props.statistics.placeType[j].value) {
                    obj.push(this.props.statistics.placeType[j].label)
                }
            }
        }
        center.placeTypeDetail = "";
        center[text] = obj.toString();
        this.props.dispatch({
            type: 'statistics/setCenter',
            payload: center,
        })
        this.props.dispatch({
            type: 'statistics/setPlaceTypeDetailList',
            payload: placeTypeDetailList,
        })
    }
    timeChange = (date, dateString) => {
        let center = this.props.statistics.center;
        center.caseDateBegin = dateString[0];
        center.caseDateEnd = dateString[1];
        this.props.dispatch({
            type: 'statistics/setCenter',
            payload: center,
        })

    }
    btnClick = () => {
        this.props.dispatch({
            type: 'statistics/getCase'
        })
        this.postMessageBDP();
    }
    //推送消息到BDP系统中
   postMessageBDP=()=>{
    let value = this.props.statistics.center;
    let p={"type":"案件查询",
     "data":{
       "派出所":value.policeArea,
       "社区":value.countyName,
       "案件类型":value.caseType!=''?value.caseType:[],
       "具体手段":value.caseTypeMethod,
       "发案部位类别":value.placeType!=''?value.placeType:[],
       "具体发案部位":value.placeTypeDetail,
       "最早发案日期":value.caseDateEnd!=''?value.caseDateEnd:[],
       "最晚发案日期":value.caseDateEnd!=''?value.caseDateEnd:[],
       "案发时段":value.timeStep
     }
    };
    document.getElementById('J_bridge').contentWindow.postMessage(p,bdpConfig);
  }
    render() {
        return (
            <div className={styles.normal}>
            <Iframe id="J_bridge" url={bdpConfig} display="none"></Iframe>
                <div className={styles.listOne}>
                    <h2 className={styles.hTwo}>查询统计案件</h2><Button className={styles.but} onClick={this.btnClick} type="primary" icon="search">搜&nbsp;索</Button>
                </div>
                <div className={styles.list}>
                    <div className={styles.left}>
                        <span>派出所:</span>
                    </div>
                    <div className={styles.right}>
                        <CheckboxGroup options={this.props.statistics.police} value={this.props.statistics.center.policeArea} onChange={this.checkCheng.bind(this, "policeArea")} />
                    </div>
                </div>
                {/* <div className={styles.list}>
                    <div className={styles.left}>
                        <span>社区:</span>
                    </div>
                    <div className={styles.right}>
                        <CheckboxGroup options={this.props.statistics.countyList} value={this.props.statistics.center.countyName} onChange={this.checkCheng1.bind(this, 'countyName')} />
                    </div>
                </div> */}
                {/* <div className={styles.list}>
                    <div className={styles.left}>
                        <span>案件类型:</span>
                    </div>
                    <div className={styles.right}>
                        <CheckboxGroup options={this.props.statistics.caseType} value={this.props.statistics.checkCaseType} onChange={this.checkCheng2.bind(this, 'caseType')} />
                    </div>
                </div> */}
                {/* <div className={styles.list}>
                    <div className={styles.left}>
                        <span>具体手段:</span>
                    </div>
                    <div className={styles.right}>
                        <CheckboxGroup options={this.props.statistics.caseTypeMethodList} value={this.props.statistics.center.caseTypeMethod} onChange={this.checkCheng1.bind(this, 'caseTypeMethod')} />
                    </div>
                </div> */}
                {/* <div className={styles.list}>
                    <div className={styles.left}>
                        <span>发案部位类别:</span>
                    </div>
                    <div className={styles.right}>
                        <CheckboxGroup options={this.props.statistics.placeType} value={this.props.statistics.checkPlaceType} onChange={this.checkCheng3.bind(this, 'placeType')} />
                    </div>
                </div> */}
                {/* <div className={styles.list}>
                    <div className={styles.left}>
                        <span>具体发案部位:</span>
                    </div>
                    <div className={styles.right}>
                        <CheckboxGroup options={this.props.statistics.placeTypeDetailList} value={this.props.statistics.center.placeTypeDetail} onChange={this.checkCheng1.bind(this, 'placeTypeDetail')} />
                    </div>
                </div> */}
                <div className={styles.list}>
                    <div className={styles.left}>
                        <span>案发日期:</span>
                    </div>
                    <div className={styles.right}>
                        <RangePicker
                            format="YYYYMMDD"
                            placeholder={['起始时间', '结束时间']}
                            onChange={this.timeChange}
                        />
                    </div>
                </div>
                <div className={styles.list}>
                    <div className={styles.left}>
                        <span>案发时段:</span>
                    </div>
                    <div className={styles.right}>
                        <CheckboxGroup options={this.props.statistics.timeType} onChange={this.checkCheng1.bind(this, 'timeStep')} />
                    </div>
                </div>
                <div className={styles.list}>
                    <div className={styles.left}>
                        <span>是否标注:</span>
                    </div>
                    <div className={styles.right}>
                       <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked onChange={this.checkCheng1.bind(this,'mark')} />
                    </div>
                </div>
            </div>
        );
    }
}
function StatisticsFun({ map, statistics }) {
    return { map, statistics };
}
export default connect(StatisticsFun)(Statistics);
