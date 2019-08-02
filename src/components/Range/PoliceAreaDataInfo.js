import React from 'react';
import styles from './SheQuDataInfo.css';
import { connect } from 'dva';
import { Select,Card,AutoComplete,Divider  } from 'antd';
class PoliceAreaDataInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {selSQqueryData,selGeometry}=this.props.policeArea;
    let noRegistryNum=parseInt(selGeometry.properties['全区暂住人口数'])
    ,registryNum=parseInt(selGeometry.properties['全区户籍人口数'])
    ,pcsregistryNum=parseInt(selGeometry.properties['属地派出所户籍人口数'])
    ,pcsNoregistryNum=parseInt(selGeometry.properties['属地派出所暂住人口数'])
    ,sqNum=parseInt(selGeometry.properties['全区社区总数'])
    ,pscsqNum=parseInt(selGeometry.properties['社区数']);
    let noRegistryNumLv=Math.round(pcsNoregistryNum/noRegistryNum*100)/100
    ,registryLv=Math.round(pcsregistryNum/registryNum*100)/100
    ,sqLv=Math.round(sqNum/pscsqNum*100)/100;
    
    let jingliNumAll=parseInt(selGeometry.properties['全区派出所警力数'])
    ,pcsJingliNum=parseInt(selGeometry.properties['派出所警力数'])
    ,sqJingliNumAll=parseInt(selGeometry.properties['全区社区警力数'])
    ,pcsSqJingliNum=parseInt(selGeometry.properties['社区警力数'])
    ,cgJingliNumAll=parseInt(selGeometry.properties['全区分局支援一村一格警力数'])
    ,pcsCgJingliNum=parseInt(selGeometry.properties['村格警力数']==''?'0':selGeometry.properties['村格警力数'])
    ,fuzhuJingliNumAll=parseInt(selGeometry.properties['全区辅警数'])
    ,pcsFuzhuJingliNum=parseInt(selGeometry.properties['辅警数']);
    let jingliLV=Math.round(pcsJingliNum/jingliNumAll*100)/100
    ,sqJingliLv=Math.round(pcsSqJingliNum/sqJingliNumAll*100)/100
    ,cgJingliLv=Math.round(pcsCgJingliNum/cgJingliNumAll*100)/100
    ,fuzhuJingliLv=Math.round(pcsFuzhuJingliNum/fuzhuJingliNumAll*100)/100;
    return (
      <div className={styles.mainIndex}>
        <div className={styles.title}>
          <span>{selGeometry!=''?selGeometry.properties['POLICE_NAME']:'未知'}</span>
          <Divider type="horizontal" className={styles.dividerLine}/>
        </div>
        <div className={styles.content}>
           <div className={styles.contentLeft}>
            <span className={styles.subTitle}>警力概况</span>
            <div className={styles.contentSubDiv}>
              <div className={styles.contentSubDivitem}><span>派出所警力数占比：</span><span style={{color:'#ff0000'}}>{jingliLV || 0}%</span>({pcsJingliNum || 0},全区{jingliNumAll || 0})</div>
              <div className={styles.contentSubDivitem}><span>社区警力数占比：</span><span style={{color:'#ff0000'}}>{sqJingliLv || 0}%</span>({pcsSqJingliNum || 0},全区{sqJingliNumAll || 0})</div>
             </div>
             <div className={styles.contentSubDiv}>
               <div className={styles.contentSubDivitem}><span>一村一格警力数占比：</span><span style={{color:'#ff0000'}}>{cgJingliLv || 0}%</span>({pcsCgJingliNum || 0},全区{cgJingliNumAll || 0})</div>
               <div className={styles.contentSubDivitem}><span>辅警数占比：</span><span style={{color:'#ff0000'}}>{fuzhuJingliLv || 0}%</span>({pcsFuzhuJingliNum || 0},全区{fuzhuJingliNumAll || 0})</div>
             </div>
             <div className={styles.contentSubDiv}>
             <span className={styles.subTitle}>刑事发案情况</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div className={styles.contentSubDivitem}><span>所在所得警情等级：</span><span style={{color:'#ff0000'}}>{selGeometry.properties['警情等级']}</span></div>
             </div>
           </div>
           <div className={styles.contentRight}>
             <span className={styles.subTitle}>人口概况</span>
             <div className={styles.contentSubDiv}>
               <div><span>社区总数占比：</span><span style={{color:'#ff0000'}}>{sqLv || 0}%</span>({sqNum || 0},全区{pscsqNum || 0})</div>
             </div>
             <div ><span>户籍人口总数占比：</span><span style={{color:'#ff0000'}}>{registryLv || 0}%</span>({pcsregistryNum || 0},全区{registryNum || 0})</div>
             <div><span>流动人口总数占比：</span><span style={{color:'#ff0000'}}>{noRegistryNumLv || 0}%</span>({pcsNoregistryNum || 0},全区{noRegistryNum || 0})</div>
           </div>
        </div>
     </div>
    )
  }
}
function mapFun({policeArea}) {
  return {policeArea};
}
export default connect(mapFun)(PoliceAreaDataInfo);
