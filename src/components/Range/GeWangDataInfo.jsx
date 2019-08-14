import React from 'react';
import styles from './SheQuDataInfo.css';
import { connect } from 'dva';
import { Select,Card,AutoComplete,Divider  } from 'antd';
class GeWangDataInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {selGWqueryData,selGeometry}=this.props.range;
    return (
      <div className={styles.mainIndex}>
        <div className={styles.title}>
          <span>村格名称:{selGeometry!=''?selGeometry.properties['网格']:'未知'}</span>
          <Divider type="horizontal" className={styles.dividerLine}/>
        </div>
        <div className={styles.content}>
           <div className={styles.contentLeft}>
            <span className={styles.subTitle}>管辖信息</span>
            <div className={styles.contentSubDiv}>
              <div className={styles.contentSubDivitem}><span>属地派出所：{selGeometry!=''?selGeometry.properties['POLICE']:''}</span></div>
              <div className={styles.contentSubDivitem}><span>属地警务室：{selGeometry!=''?selGeometry.properties['属地警务社区']:''}</span></div>
             </div>
             <div className={styles.contentSubDiv}>
               <div className={styles.contentSubDivitem}><span>属地警务社区：{selGeometry!=''?selGeometry.properties['COUNTY_NAME']:''}</span></div>
               <div className={styles.contentSubDivitem}><span>社区民警：{selGeometry!=''?selGeometry.properties['COUNTY_POLICE']:''}</span></div>
             </div>
             <div className={styles.contentSubDiv}>
               <div className={styles.contentSubDivitem}><span>社区民警编号：{selGeometry!=''?selGeometry.properties['COUNTY_POLICE_NUM']:''}</span></div>
               <div className={styles.contentSubDivitem}><span>社区民警联系电话：{selGWqueryData!=''?selGWqueryData['社区民警联系电话']:''}</span></div>
             </div>
           </div>
           <div className={styles.contentRight}>
             <span className={styles.subTitle}>村格基本信息</span>
             <div className={styles.contentSubDiv}>
               <div className={styles.contentSubDivitem}><span>村格民警：{selGWqueryData!=''?selGWqueryData['村格民警']:''}</span></div>
               <div className={styles.contentSubDivitem}><span>村格民警编号：{selGWqueryData!=''?selGWqueryData['村格民警警号']:''}</span></div>
             </div>
             <div className={styles.contentSubDiv}>
               <span>村格民警联系电话：{selGWqueryData!=''?selGWqueryData['村格民警联系电话']:''}</span>
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
export default connect(mapFun)(GeWangDataInfo);
