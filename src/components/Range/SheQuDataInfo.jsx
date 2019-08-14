import React from 'react';
import styles from './SheQuDataInfo.css';
import { connect } from 'dva';
import { Select,Card,AutoComplete,Divider  } from 'antd';
class SheQuDataInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {selSQqueryData,selGeometry,pcs}=this.props.range;
    let pcsObj=pcs.filter(item=>item.properties["POLICE_NUM"]==selGeometry.properties['POLICE_NUM'])[0];
    let registryNum=parseInt(selGeometry.properties['户籍人口数']),registryNumAll=parseInt(pcsObj.properties['属地派出所户籍人口数'])
    ,noRegistryNum=parseInt(selGeometry.properties['暂住人口数']),noRegistryNumAll=parseInt(pcsObj.properties['属地派出所暂住人口数'])
    ,actualNum=(registryNum+noRegistryNum),actualNumAll=parseInt(pcsObj.properties['属地派出所实有人口数']);
    let actualNumLv=Math.round(actualNum/actualNumAll*100)/100
    ,noRegistryLv=Math.round(noRegistryNum/noRegistryNumAll*100)/100
    ,registryLv=Math.round(registryNum/registryNumAll*100)/100,caseNumLv=0;
    if(selSQqueryData!=''){
      caseNumLv=Math.round(selSQqueryData.caseNum/selSQqueryData.caseNumAll*100)/100;
    }        
    return (
      <div className={styles.mainIndex}>
        <div className={styles.title}>
          <span>{selGeometry!=''?(selGeometry.properties['POLICETE_1']+"("+selGeometry.properties['辖区名称']+")"):'未知'}</span>
          <Divider type="horizontal" className={styles.dividerLine}/>
        </div>
        <div className={styles.content}>
           <div className={styles.contentLeft}>
           <span className={styles.subTitle}>基本信息</span>
            <div className={styles.contentSubDiv}>
              <div className={styles.contentSubDivitem}><span>所属派出所：{selGeometry.properties['POLICE']}</span></div>
              <div className={styles.contentSubDivitem}><span>警务室名称：{selGeometry.properties['POLICEROOM']}</span></div>
             </div>
            <span className={styles.subTitle}>人口概况</span>
            <div className={styles.contentSubDiv}>
              <div className={styles.contentSubDivitem}><span>实有人口占比：</span><span style={{color:'#ff0000'}}>{actualNumLv}%</span>({actualNum},分局{actualNumAll})</div>
              <div className={styles.contentSubDivitem}><span>户籍人口占比：</span><span style={{color:'#ff0000'}}>{registryLv}%</span>({registryNum},分局{registryNumAll})</div>
             </div>
             <div className={styles.contentSubDiv}>
               <div className={styles.contentSubDivitem}><span>流动人口占比：</span><span style={{color:'#ff0000'}}>{noRegistryLv}%</span>({noRegistryNum},分局{noRegistryNumAll})</div>
             </div>
           </div>
           <div className={styles.contentRight}>
             <span className={styles.subTitle}>刑事发案情况</span>
             <div className={styles.contentSubDiv}>
               <div className={styles.contentSubDivitem}><span>所在所得警情等级：</span><span style={{color:'#ff0000'}}>{pcsObj.properties["警情等级"]}</span></div>
               <div className={styles.contentSubDivitem}><span>全年案件总数占比：</span><span style={{color:'#ff0000'}}>{caseNumLv}%({selSQqueryData.caseNum})</span></div>
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
export default connect(mapFun)(SheQuDataInfo);
