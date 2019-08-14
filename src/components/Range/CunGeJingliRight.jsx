import React from 'react';
import styles from './CunGeJingliRight.css';
import { connect } from 'dva';
import {userAvABaseUrl} from '../../services/config'
import { Select,Card,AutoComplete,Divider  } from 'antd';
import defultImage from '../../../public/img/defalutImg.png';
function isHasImg(pathImg){  
  var ImgObj=new Image();  
  ImgObj.src= pathImg;  
   if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0))  
   {  
     return true;  
   } else {  
     return false;  
  }  
} 

class CunGeJingliRight extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {selGWqueryData}=this.props.range;
    return (
      <div className={styles.mainIndex}>
        <div className={styles.title}><span>村格警力概况</span></div>
        <Divider type="horizontal" className={styles.dividerline}/>
        <div className={styles.content}>
          <div className={styles.memberInfo}>
           <img src={selGWqueryData!=''?userAvABaseUrl+'cunge/'+selGWqueryData['村格民警警号']+'.jpg':defultImage}/>
            <div className = {styles.memberText}>
            <span>警员姓名:{selGWqueryData!=''?selGWqueryData['村格民警']:''}</span>
            <span>警员编号:{selGWqueryData!=''?selGWqueryData['村格民警警号']:''}</span>
              </div>
          </div>
        </div>
     </div>
    )
  }
}
function mapFun({range}) {
  return {range};
}
export default connect(mapFun)(CunGeJingliRight);
