import React from 'react';
import styles from './SheQuJingliRight.css';
import { connect } from 'dva';
import { Divider  } from 'antd';
import {userAvABaseUrl} from '../../services/config'
import defultImage from '../../../public/img/defalutImg.png';
class SheQuJingliRight extends React.Component {
  constructor(props) {
    super(props);
  }
  removeAllSpace=(str)=>{
    return str.replace(/\s+/g, "");
  }
  render() {
    const {selGeometry}=this.props.range;
    let cungeItems=[];
    let shequItems=[];
    if(selGeometry!=''){
      let nNum=selGeometry.properties["辖区警号"];
      let nName=selGeometry.properties["辖区民警"];
      let nMobile=selGeometry.properties["辖区电话"];
      let pNum=(nNum!=""?nNum.split("，"):[]);
      let pName=(nName!=""?nName.split("，"):[]);
      let pMobile=(nMobile!=""?nMobile.split("，"):[]);
      shequItems=pNum.map((item, index)=>{
        return (
          <div key={index} className={styles.memberInfo}>
            <img src={pNum[index]!=''?userAvABaseUrl+'shequ/'+pNum[index]+'.jpg':defultImage}/>
            <div className = {styles.memberText}>
            <span>警员姓名:{pName[index]}</span>
            <span>警员编号:{pNum[index]}</span>
            <span>电话:{pMobile[index]}</span>
              </div>
          </div>
        )
      })
      let mNum=selGeometry.properties["村格警号"];
      let mName=selGeometry.properties["村格民警"];
      let mMobile=selGeometry.properties["村格电话"];
      let pcungeNum=(mNum!=""?mNum.split("，"):[]);
      let pcungeName=(mName!=""?mName.split("，"):[]);
      let pcungeMobile=(mMobile!=""?mMobile.split("，"):[]);
      cungeItems=pcungeNum.map((item,index)=>{
        let userAve=defultImage;
        if(item!=''){
          userAve=userAvABaseUrl+'cunge/'+item+".jpg";
        }
        return (
          <div key={index} className={styles.memberInfo}>
            <img src={userAve}/>
            <div className = {styles.memberText}>
            <span>警员姓名: {pcungeName[index]}</span>
            <span>警员编号: {item}</span>
            <span>电话: {pcungeMobile[index]}</span>
              </div>
          </div>
        )
      })

   }
    return (
      <div className={styles.mainIndex}>
        <div className={styles.title}><span>社区警力概况</span></div>
        <Divider type="horizontal" className={styles.dividerline}/>
        <div className={styles.content}>
            <div className={styles.subTitleBox}>
            <span className={styles.subTitleText}>社区民警</span>
            <Divider type="horizontal" className={styles.subTitleLine}/>
            </div>
          {shequItems}
          <div className={styles.subTitleBox}>
            <span className={styles.subTitleText}>一村一格</span>
            <Divider type="horizontal" className={styles.subTitleLine}/>
          </div>
          {cungeItems}
        </div>
     </div>
    )
  }
}
function mapFun({range}) {
  return {range};
}
export default connect(mapFun)(SheQuJingliRight);
