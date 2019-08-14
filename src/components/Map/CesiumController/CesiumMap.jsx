import React from 'react';
import styles from './CesiumMap.css';
import { connect } from 'dva';
import { Upload, Icon, message, Button, Select, Switch, Input, Tree } from 'antd';
const Search = Input.Search;
const TreeNode = Tree.TreeNode;

// const x = 3;
// const y = 2;
// const z = 1;
// const gData = [];

// const generateData = (_level, _preKey, _tns) => {
//   const preKey = _preKey || '0';
//   const tns = _tns || gData;

//   const children = [];
//   for (let i = 0; i < x; i++) {
//     const key = `${preKey}-${i}`;
//     tns.push({ title: key, key });
//     if (i < y) {
//       children.push(key);
//     }
//   }
//   if (_level < 0) {
//     return tns;
//   }
//   const level = _level - 1;
//   children.forEach((key, index) => {
//     tns[index].children = [];
//     return generateData(level, key, tns[index].children);
//   });
// };
// generateData(z);

// const dataList = [];
// const generateList = (data) => {
//   for (let i = 0; i < data.length; i++) {
//     const node = data[i];
//     const key = node.key;
//     dataList.push({ key, title: key });
//     if (node.children) {
//       generateList(node.children, node.key);
//     }
//   }
// };
// generateList(gData);

// const getParentKey = (key, tree) => {
//   let parentKey;
//   for (let i = 0; i < tree.length; i++) {
//     const node = tree[i];
//     if (node.children) {
//       if (node.children.some(item => item.key === key)) {
//         parentKey = node.key;
//       } else if (getParentKey(key, node.children)) {
//         parentKey = getParentKey(key, node.children);
//       }
//     }
//   }
//   return parentKey;
// };
class CesiumMap extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        //console.log(gData)
    }
    onChange = (e) => {
        const value = e.target.value;
        const expandedKeys = this.props.threeCameraManagement.dataList.map((item) => {
            if (item.key.indexOf(value) > -1) {
                return this.getParentKey(item.key, this.props.threeCameraManagement.gData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        this.props.dispatch({
            type: 'threeCameraManagement/setExpandedKeys',
            payload: expandedKeys
        })
        this.props.dispatch({
            type: 'threeCameraManagement/setSearchValue',
            payload: value
        })
        this.props.dispatch({
            type: 'threeCameraManagement/setAutoExpandParent',
            payload: true
        })
    }
    getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.key === key)) {
                    parentKey = node.key;
                } else if (this.getParentKey(key, node.children)) {
                    parentKey = this.getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };
    onExpand = (expandedKeys) => {
        this.props.dispatch({
            type: 'threeCameraManagement/setExpandedKeys',
            payload: expandedKeys
        })
        this.props.dispatch({
            type: 'threeCameraManagement/setAutoExpandParent',
            payload: false
        })
    }
    changeFun = (key) => {
        if (key) {
            this.props.dispatch({
                type: 'threeCameraManagement/getPoliceList',
                payload: 1
            })
            this.props.dispatch({
                type: 'threeCameraManagement/setCheckable',
                payload: true
            })
            let time = setInterval(()=>{
                let arr = this.props.threeCameraManagement.checkedKeys;
                if(arr.length>0){
                    this.props.dispatch({
                        type:'threeCameraManagement/getPoliceLocation',
                        payload:arr
                    })
                }
            },1000)
            this.props.dispatch({
                type:'threeCameraManagement/setTimeObj',
                payload:time
            })
        } else {
            clearInterval(this.props.threeCameraManagement.timeObj)
            this.props.dispatch({
                type: 'threeCameraManagement/getPoliceList',
                payload: 0
            })
            this.props.dispatch({
                type: 'threeCameraManagement/setCheckable',
                payload: false
            })
        }
        this.props.dispatch({
            type: 'threeCameraManagement/setCheckedKeys',
            payload: []
        })
    }
    onCheck = (checkedKeys,e) => {
        if (checkedKeys.length > 4) {
            message.error('当前支持最大支持定位4人！');
        } else {
            console.log(checkedKeys,e)
            this.props.dispatch({
                type: 'threeCameraManagement/setCheckedKeys',
                payload: checkedKeys
            })
            this.props.dispatch({
                type: 'threeCameraManagement/setTabData',
                payload: checkedKeys
            })
        }
    }
    render() {
        const { searchValue, expandedKeys, autoExpandParent, gData } = this.props.threeCameraManagement;
        const loop = data => data.map((item) => {
            const index = item.key.indexOf(searchValue);
            const beforeStr = item.key.substr(0, index);
            const afterStr = item.key.substr(index + searchValue.length);
            const title = index > -1 ? (
                <span>
                    {beforeStr}
                    <span style={{ color: '#f50' }}>{searchValue}</span>
                    {afterStr}
                </span>
            ) : <span>{item.key}</span>;
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title} />;
        });
        return (<div className={styles.indexDiv}>
            <h2 className={styles.hTwo}>人员管理</h2>
            <div className={styles.divTop}>
                <span>实时定位</span><Switch checkedChildren="开" unCheckedChildren="关" className={styles.Switch} onChange={this.changeFun} />
            </div>
            <div className={styles.divNav}>
                <Search placeholder="请输入警员编号" onChange={this.onChange} />
            </div>
            <div className={styles.divButtom}>
                <Tree
                    style={{ color: '#fff' }}
                    checkable={this.props.threeCameraManagement.checkable}
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={this.onCheck}
                    checkedKeys={this.props.threeCameraManagement.checkedKeys}
                    // onSelect={this.onSelect}
                    // selectedKeys={this.state.selectedKeys}
                    selectable={false}
                >
                    {loop(gData)}
                </Tree>
            </div>
        </div>)
    }
}
function CesiumMapFun({ threeCameraManagement, cesium }) {
    return { threeCameraManagement, cesium };
}
export default connect(CesiumMapFun)(CesiumMap);
