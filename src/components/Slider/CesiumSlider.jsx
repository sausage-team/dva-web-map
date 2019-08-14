import React from 'react';
import styles from './CesiumSlider.css';
import { connect } from 'dva';
import { Slider, Button } from 'antd';
class CesiumSlider extends React.Component {
  constructor(props) {
    super(props);
    this.marks = {
      0: {
        style: {
          color: '#fff',
        },
        label: (<strong>0</strong>),
      },
      4: {
        style: {
          color: '#fff',
        },
        label: (<strong>1</strong>),
      },
      8: {
        style: {
          color: '#fff',
        },
        label: <strong>2</strong>,
      },
      12: {
        style: {
          color: '#fff',
        },
        label: <strong>3</strong>,
      },
      16: {
        style: {
          color: '#fff',
        },
        label: <strong>4</strong>,
      },
      20: {
        style: {
          color: '#fff',
        },
        label: <strong>5</strong>,
      },
      24: {
        style: {
          color: '#fff',
        },
        label: <strong>6</strong>,
      },
      28: {
        style: {
          color: '#fff',
        },
        label: <strong>7</strong>,
      },
      32: {
        style: {
          color: '#fff',
        },
        label: <strong>8</strong>,
      },
      36: {
        style: {
          color: '#fff',
        },
        label: <strong>9</strong>,
      },
      40: {
        style: {
          color: '#fff',
        },
        label: <strong>10</strong>,
      },
      44: {
        style: {
          color: '#fff',
        },
        label: <strong>11</strong>,
      },
      48: {
        style: {
          color: '#fff',
        },
        label: <strong>12</strong>,
      },
      52: {
        style: {
          color: '#fff',
        },
        label: <strong>13</strong>,
      },
      56: {
        style: {
          color: '#fff',
        },
        label: <strong>14</strong>,
      },
      60: {
        style: {
          color: '#fff',
        },
        label: <strong>15</strong>,
      },
      64: {
        style: {
          color: '#fff',
        },
        label: <strong>16</strong>,
      },
      68: {
        style: {
          color: '#fff',
        },
        label: <strong>17</strong>,
      },
      72: {
        style: {
          color: '#fff',
        },
        label: <strong>18</strong>,
      },
      76: {
        style: {
          color: '#fff',
        },
        label: <strong>19</strong>,
      },
      80: {
        style: {
          color: '#fff',
        },
        label: <strong>20</strong>,
      },
      84: {
        style: {
          color: '#fff',
        },
        label: <strong>21</strong>,
      },
      88: {
        style: {
          color: '#fff',
        },
        label: <strong>22</strong>,
      },
      92: {
        style: {
          color: '#fff',
        },
        label: <strong>23</strong>,
      },
      96: {
        style: {
          color: '#fff',
        },
        label: <strong>24</strong>,
      },
    };
  }
  componentDidMount() {
    this.setTime();
  }
  //全局的定时器
  timeOut = () => {
    let stateTime = this.props.personnelTrajectory.stateTime;
    let endTime = this.props.personnelTrajectory.endTime;
    let timeOut = setInterval(() => {
      let time = this.props.personnelTrajectory.time;
      if (time < endTime) {
        time += 20;
      } else {
        time = 0;
      }
      this.props.dispatch({
        type: 'personnelTrajectory/setTime',
        payload: time
      })
      this.props.dispatch({
        type: 'personnelTrajectory/pointMap',
        payload: time
      })
      let num = parseInt(time / 864)
      this.props.dispatch({
        type: 'personnelTrajectory/setMarks',
        payload: num
      })
    }, stateTime);
    this.props.dispatch({
      type: 'personnelTrajectory/setTimeOut',
      payload: timeOut
    })
  }
  //设置全局的时间
  setTime = () => {
    this.props.dispatch({
      type: 'personnelTrajectory/setTimeFun',
      payload: this.timeOut.bind(this)
    })
  }

  changeFun = (value) => {
    let num = parseInt(parseInt(value) * 864);
    this.props.dispatch({
      type: 'personnelTrajectory/setTime',
      payload: num
    })
  }
  blurFun = () => {
    console.log(1)
  }
  focusFun = () => {
    console.log(2)
  }
  butClick = () => {
    if (this.props.personnelTrajectory.timeState) {
      this.props.dispatch({
        type: 'personnelTrajectory/shutTimeOpen'
      })
    } else {
      this.props.dispatch({
        type: 'personnelTrajectory/setTimeOpen'
      });
      this.props.dispatch({
        type: 'personnelTrajectory/setTimeState',
        payload: true
      })
    }
  }
  formatter=(value)=>{
    let val=parseInt(value)
    if(val == 0){
      return `00:00`;
    }else{
      let intNum = parseInt(val/4);
      let floNum = parseInt(val%4*15);
      return `${intNum}:${floNum}`;
    }
  }
  render() {
    return (
      <div className={styles.normal}>
        <Button className={styles.but} shape="circle" onClick={this.butClick} icon={this.props.personnelTrajectory.timeState ? 'pause-circle' : 'play-circle'} />
        <Slider tipFormatter={this.formatter} min={0} max={96} marks={this.marks} defaultValue={0} value={this.props.personnelTrajectory.marks} onChange={this.changeFun} onClick={this.blurFun} onmouseup={this.focusFun}>
        </Slider>
      </div>
    );
  }
}
function CesiumSliderFun({ cesium, personnelTrajectory }) {
  return { cesium, personnelTrajectory };
}
export default connect(CesiumSliderFun)(CesiumSlider);
