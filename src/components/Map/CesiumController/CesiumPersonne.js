import React from 'react';
import styles from './CesiumPersonne.css';
import { connect } from 'dva';
import { Upload, Icon, message, Button, Select, Spin,Input,DatePicker,Switch} from 'antd';
import { width } from 'window-size';
class CesiumPersonne extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        
    }
    inputFun=(value,str)=>{
        let policeObj =this.props.personnelTrajectory.policeObj;
        policeObj = {
            ...policeObj,
            ...{policeNo:str.target.value}
        }
        this.props.dispatch({
            type:'personnelTrajectory/setPoliceObj',
            payload:policeObj
        })
    }
    changeFun=(date,dateString)=>{
        let policeObj =this.props.personnelTrajectory.policeObj;
        policeObj = {
            ...policeObj,
            ...{beginTime:dateString+' 00:00:00',endTime:dateString+' 23:59:59'}
        }
        this.props.dispatch({
            type:'personnelTrajectory/setPoliceObj',
            payload:policeObj
        })
    }
    clickFun=()=>{
        this.props.dispatch({
            type:'personnelTrajectory/shutTimeOpen',
        })
        this.props.dispatch({
           type:'personnelTrajectory/setWitchData' ,
           payload:false
        })
        this.props.dispatch({
            type:'personnelTrajectory/getPoliceRoute',
        })
    }
    changeSwitch=(checked)=>{
        this.props.dispatch({
            type:'personnelTrajectory/shutTimeOpen',
        })
        this.props.dispatch({
           type:'personnelTrajectory/setWitchData' ,
           payload:false
        })
        this.props.dispatch({
            type:'personnelTrajectory/setPoliceObj',
            payload:{
                policeNo: '',
                beginTime: '',
                endTime: '',
                parsePattern: 'yyyy-MM-dd HH:mm:ss'
              }
        })
        if(checked){
            this.props.dispatch({
                type:'personnelTrajectory/setSwitchData',
                payload:checked
            })
            this.props.dispatch({
                type:'personnelTrajectory/setInputValue',
                payload:'请输入车牌号'
            })
        }else{
            this.props.dispatch({
                type:'personnelTrajectory/setSwitchData',
                payload:checked
            })
            this.props.dispatch({
                type:'personnelTrajectory/setInputValue',
                payload:'请输入警员编号'
            })
        }
    }
    render() {
        return (<div className={styles.indexDiv}>
            <h2 className={styles.hTwo}>轨迹查询<Switch className={styles.Switch} checkedChildren="车" unCheckedChildren="人" onChange={this.changeSwitch}/></h2>
            <div>
                <Input placeholder={this.props.personnelTrajectory.inputValue} className={styles.inp} onChange={this.inputFun.bind(this,'policeNo')} />
                <br/>
                <DatePicker popupStyle={{width:'260px'}} onChange={this.changeFun} placeholder="请选择查询的日期" showToday={false} className={styles.time}/>
                <br/>
                <Button type="primary" className={styles.btn} onClick={this.clickFun}>开始查询</Button>
            </div>
        </div>)
    }
}
function CesiumPersonneFun({ cesium,personnelTrajectory }) {
    return { cesium,personnelTrajectory };
}
export default connect(CesiumPersonneFun)(CesiumPersonne);
