import React from 'react';
import styles from './QueryAreaSelect.css';
import { connect } from 'dva';
import { Select, AutoComplete, Divider, Switch } from 'antd';
// import { valid } from '../../services/user';
import { fangKong,bdpConfig } from '../../services/config';
const Option = Select.Option;
class QueryAreaSelect extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    dataSource: [],
  }

  handleCqSqChange = (value) => {
    let datasets = fangKong.datasets;
    const { pcs, selectData, cqsq, mapType } = this.props.range;
    let cqsqObj = cqsq.filter(item => item.id == value);
    if (cqsqObj.length > 0) {
      let twoOptions = pcs.filter(item => item.properties[datasets.level2.filedKeyArea] == cqsqObj[0].properties[datasets.level1.filedKeyName]);
      let oneOptions = selectData['oneOptions'];
      let sellevel = 1;
      this.props.dispatch({
        type: 'range/updateStateData',
        payload: {
          selectData: {
            oneOptions: oneOptions,
            twoOptions: twoOptions,
            threeOptions: []
          },
          selGeometry: cqsqObj[0],
          level: sellevel,
        }
      })
      this.showViewNone();
      //高亮 并定位
      if (mapType == 1) {//二维
        this.props.twoHightToMap(cqsqObj[0], sellevel);
      } else {
        this.props.threeHightToMap(cqsqObj[0]);
      }
    }
  }

  handlePcsChange = (value) => {
    let datasets = fangKong.datasets;
    const { shequ, selectData, pcs } = this.props.range;
    let pcsObj = pcs.filter(item => item.id == value);
    if (pcsObj.length > 0) {
      let threeOptions = shequ.filter(item => item.properties[datasets.level3.filedKeyPolice] == pcsObj[0].properties[datasets.level2.filedKeyName]);
      selectData['threeOptions'] = threeOptions;
      selectData['fourOptions'] = [];
      this.props.dispatch({
        type: 'range/updateStateData',
        payload: {
          selectData: selectData
        }
      })
    }
    this.showViewNone();
  }

  handleSheQuChange = (value) => {
    this.shequChange(value);
    let datasets = fangKong.datasets;
    const {shequ} = this.props.range;
    let sheQuObj = shequ.filter(item => item.id == value);
    if (sheQuObj.length > 0) {
      this.postMessageBDP(sheQuObj[0].properties[datasets.level3.filedKeyName]);
    }
  }
  shequChange=(value)=>{
    // let datasets = fangKong.datasets;
    const { selectData, shequ, mapType } = this.props.range;
    let sheQuObj = shequ.filter(item => item.id == value);
    if (sheQuObj.length > 0) {
      //高亮 并定位
      if (mapType == 1) {//二维
        this.props.twoHightToMapHasHeight(sheQuObj[0]);
      } else {
        this.props.threeHightToMap(sheQuObj[0]);
      }
      this.props.dispatch({
        type: 'range/updateStateData',
        payload: {
          selectData: selectData,
          selGeometry: sheQuObj[0],
          level: 3,
        }
      })
      this.props.dispatch({
        type: 'range/sqDetail',
        payload: {
          id: sheQuObj[0].id
        }
      })
      this.showSheQuView();
    }
  }
  //推送消息到BDP系统中
  postMessageBDP=(value)=>{
    let p={"type":"社区查询","data":{"社区名称":[value]}};
    document.getElementById('J_bridge').contentWindow.postMessage(p,bdpConfig);
  }
  getMessageBDP=(e)=>{
    if (e.data) {
      let datas=JSON.parse(e.data);
      let name=datas.data['社区名称'][0];
      if(name){
        this.onSelect(name)
      }
    }
  }
   //初次渲染
   componentDidMount() {
    this.props.dispatch({
      type: 'range/updateStateData',
      payload: {
        handlePcsChange: this.handlePcsChange,
        handleSheQuChange: this.handleSheQuChange,
        handleCqSqChange: this.handleCqSqChange,
        handleYCYGChange: this.handleYCYGChange,
      }
    });
    window.addEventListener('message',this.getMessageBDP, false);
  }

  //销毁
  componentWillUnmount() {
    let map = this.props.map.mapObj;
    let selGeometryObj = map.getSource('selGeometry');
    if (selGeometryObj != null) {
      map.removeLayer('selGeometry')
      map.removeSource('selGeometry')
    }
    this.showViewNone();
  }

  showSheQuView = () => {
    this.props.dispatch({
      type: 'range/updateStateUi',
      payload: {
        sqFootModelView: true,
        sqRightModelView: true,
        cgFootModelView: false,
        cgRightModelView: false,
      }
    })
  }

  showViewNone = () => {
    this.props.dispatch({
      type: 'range/updateStateUi',
      payload: {
        sqFootModelView: false,
        sqRightModelView: false,
        cgFootModelView: false,
        cgRightModelView: false,
      }
    })
  }

  handleSearch = (value) => {
    const { searchData } = this.props.range;
    let datas = searchData.filter(item => item.indexOf(value) > -1);
    this.setState({
      dataSource: datas,
    });
  }
  onSelect = (value) => {
    let datasets = fangKong.datasets;
    const { shequ } = this.props.range;
    let sheQuObj = shequ.filter(item => item.properties[datasets.level3.filedKeyName] == value);
    if (sheQuObj.length > 0) {
      this.handleSheQuChange(sheQuObj[0].id)
    }
  }
  mapChange = (key) => {
    let maptype = this.props.range.mapType;
    maptype = (key ? 2 : 1);
    this.props.dispatch({
      type: 'range/updateStateData',
      payload: {
        mapType: maptype,
      }
    })
  }
  render() {
    let datasets = fangKong.datasets;
    const { dataSource } = this.state;
    const { oneOptions, twoOptions, threeOptions } = this.props.range.selectData;
    const oneSelect = oneOptions.map(item => <Option key={item.id}>{item.properties[datasets.level1.filedKeyName]}</Option>);
    const twoSelect = twoOptions.map(item => <Option key={item.id}>{item.properties[datasets.level2.filedKeyName]}</Option>);
    const threeSelect = threeOptions.map(item => <Option key={item.id}>{item.properties[datasets.level3.filedKeyName]}</Option>);
    return (
      <div className={styles.mainBox}>
        <div className={styles.title}><span>社区查询</span><Switch checkedChildren="二维" unCheckedChildren="三维" className={styles.Switch} onChange={this.mapChange} /></div>
        <Divider type="horizontal" className={styles.dividerline} />
        <div>
          <AutoComplete
            dataSource={dataSource}
            className={styles.search}
            onSelect={this.onSelect}
            onSearch={this.handleSearch}
            placeholder="请输入您要检索的社区名称"
          />
        </div>
        <div className={styles.areaBox}>
          <Select size="small" defaultValue="城区" style={{ width: '35%', marginRight: 10 }} onChange={this.handleCqSqChange}>
            {oneSelect}
          </Select>
          <Select id='pcstext' size="small" style={{ width: '61%' }} placeholder="-选择派出所-" onChange={this.handlePcsChange}>
            {twoSelect}
          </Select>
        </div>
        <div className={styles.areaBox}>
          <Select size="small" style={{ width: '100%' }} placeholder="- 选择社区 -" onChange={this.handleSheQuChange}>
            {threeSelect}
          </Select>
        </div>
      </div>
    )
  }
}
function mapFun({ range, map }) {
  return { range, map };
}
export default connect(mapFun)(QueryAreaSelect);
