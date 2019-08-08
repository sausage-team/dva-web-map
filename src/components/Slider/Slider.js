import React from 'react';
import styles from './Slider.css';
import { connect } from 'dva';
import { Slider,Button } from 'antd';
import { routerRedux } from 'dva/router';
class SliderDiv extends React.Component {
  constructor(props) {
    super(props);
  }
  changeFun = (value) =>{
   let num =parseInt(parseInt(value)*87.6);
    this.props.dispatch({
      type:'map/setTime',
      payload:num
    })
  }
  blurFun =() =>{
    console.log(1)
  }
  focusFun =() =>{
    console.log(2)
  }
  butClick= ()=>{
    debugger
    if(this.props.map.timeState){
      this.props.dispatch({
        type:'map/shutTimeOpen'
      })
    }else{
      this.props.dispatch({
        type:'map/setTimeOpen'
      });
      this.props.dispatch({
        type:'map/setTimeState',
        payload:true
      })
    }
  }
  render() {
    const marks = {
      0: {
        style: {
          color: '#fff',
        },
        label: <strong>0</strong>,
      },
      8:{
        style: {
          color: '#fff',
        },
        label: <strong>1</strong>,
      },
      16:{
        style: {
          color: '#fff',
        },
        label: <strong>2</strong>,
      },
      24: {
        style: {
          color: '#fff',
        },
        label: <strong>3</strong>,
      },
      32:{
        style: {
          color: '#fff',
        },
        label: <strong>4</strong>,
      },
      40:{
        style: {
          color: '#fff',
        },
        label: <strong>5</strong>,
      },
      48: {
        style: {
          color: '#fff',
        },
        label: <strong>6</strong>,
      },
      56:{
        style: {
          color: '#fff',
        },
        label: <strong>7</strong>,
      },
      64:{
        style: {
          color: '#fff',
        },
        label: <strong>8</strong>,
      },
      72:{
        style: {
          color: '#fff',
        },
        label: <strong>9</strong>,
      },
      80: {
        style: {
          color: '#fff',
        },
        label: <strong>10</strong>,
      },
      88: {
        style: {
          color: '#fff',
        },
        label: <strong>11</strong>,
      },
      100: {
        style: {
          color: '#fff',
        },
        label: <strong>12</strong>,
      },
    };   
    return (
      <div className = {styles.normal}>
        <Button className={styles.but} shape="circle" onClick={this.butClick}  icon={this.props.map.timeState?'pause-circle':'play-circle'} />
        <Slider marks={marks} defaultValue={0} value={this.props.map.marks} onChange={this.changeFun} onClick={this.blurFun} onmouseup ={this.focusFun}>
        </Slider>
      </div>
    );
  }
}
function sliderFun({ map }) {
  return { map };
}
export default connect(sliderFun)(SliderDiv);
