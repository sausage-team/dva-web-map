import React from 'react';
// import styles from './Updata.css';
import { connect } from 'dva';
import { Upload, Icon, message, Button } from 'antd';
class Updata extends React.Component {
  constructor(props) {
    super(props);
  }
  //控制是否添加完立即上传
  beforeUpload = (file) => {
    this.props.dispatch({
      type: 'caseEntry/setModel',
      payload: false
    })
    this.removeMissingdivCss();
    //校验当前上传的文件大小
    const type = ['xls'];
    let size = file.size
    let name = file.name.split('.');
    if (size / 1024 / 1024 > 5) {
      message.error(`${file.name}上传文件过大，请重新选择.`)
      return false
    }
    if (type.indexOf(name[1]) <= -1) {
      message.error(`${file.name} 数据格式不正确.`)
      return false
    }
  }
  //当上传数据发生变化时的回调函数
  upLoadCheng = (info) => {
    // let response = info.file.response;
    const status = info.file.status;
    if (status === 'done') {
      this.props.dispatch({
        type: 'caseEntry/setUpdata',
        payload: info.file.response
      })
      if (info.file.response) {
        let updata = info.file.response;
        let okList = [];
        let errorList = [];
        // let data = [];
        for (let i in updata.data.errorList) {
          let obj = {
            key: i,
            ...updata.data.errorList[i]
          }
          errorList.push(obj)
        }
        for (let i in updata.data.okList) {
          let obj = {
            key: i,
            ...updata.data.okList[i]
          }
          okList.push(obj)
        }
        this.props.dispatch({
          type: 'caseEntry/setOkList',
          payload: okList
        })
        this.props.dispatch({
          type: 'caseEntry/setErrorList',
          payload: errorList
        })
      }
      this.props.dispatch({
        type: "caseEntry/setTabName",
        payload: ["校验成功", "校验失败"]
      })
      this.props.dispatch({
        type: 'caseEntry/setModel',
        payload: true
      })
      message.success(`上传成功，请及时编辑你的数据.`);
    } else if (status === 'error') {
      message.error(`上传失败，请重试.`);
    }
  }
  removeMissingdivCss = () => {
    const missingdiv = document.querySelector(".ant-upload-list-text");
    if (missingdiv) missingdiv.style.display = "none";
    const mapDOM = document.querySelector(".ant-upload-list");
    if (mapDOM) mapDOM.style.display = "none";
  }
  render() {
    return (
      <Upload {...this.props.caseEntry.updatastate} onChange={this.upLoadCheng} beforeUpload={this.beforeUpload} >
        <Button type="primary" >
          <Icon type="upload" /> 案件上传
        </Button>
      </Upload>
    )
  }
}
function upDataModel({ caseEntry }) {
  return { caseEntry };
}
export default connect(upDataModel)(Updata);
