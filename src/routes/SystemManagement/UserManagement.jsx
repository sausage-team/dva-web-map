import React from 'react';
import { connect,dispatch } from 'dva';
import { Table, Icon, Divider,Button,Dropdown,Menu,Breadcrumb,Input,Modal,message} from 'antd';
import styles from './UserManagement.css';
import AddUser from '../../components/users/AddUser'
import UpdateUser from '../../components/users/UpdateUser'
const Search = Input.Search;
class UserManagement extends React.Component {
  constructor(props) {
    super(props);
  }
  showUpdateLayer=(record)=>{
     this.props.dispatch({
      type: 'userlist/updateStateData',
      payload:{
        modalUpdateVisible:true,
        curItem:record
      }
    });
  }
  columns=[{
    title: '警员编号',
    dataIndex: 'username',
    key: 'username',
  }, {
    title: '姓名',
    dataIndex: 'realname',
    key: 'realname',
  }, {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
  }, {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  }, {
    title: '派出所',
    dataIndex: 'pcsname',
    key: 'pcsname',
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: function(text, record){
      return text==1?'正常':'停用';
      }
  }, {
    title: '操作',
    dataIndex: 'userId',
    key: 'userId',
    width: 80,
    render: (text, record)=>{    
      return (
        <span><a href="#" onClick={()=>{(this.showUpdateLayer(record))}}>修改</a></span>
      );
    }
  }];
  

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.props.dispatch({
            type: 'userlist/setSelectedRowKeys',
            payload: selectedRowKeys
       })
    }
  }
  showAddLayer=()=>{
    this.props.dispatch({
      type: 'userlist/updateStateData',
      payload:{
        modalVisible:true
      }
    })
  }
  handleDelete = () =>{
    this.props.dispatch({
      type: 'userlist/deluser'
    });
  }
  querySearchList = (key) =>{
    this.props.dispatch({
      type: 'userlist/query',
      payload: key,
    });
  }
  
  render() {
    const {policeData}=this.props.userlist
    return (
      <div className={styles.mainBox}>
        <div style={{ marginBottom: 16 }}>
        <Breadcrumb style={{marginBottom:10}}>
    <Breadcrumb.Item>Home</Breadcrumb.Item>
    <Breadcrumb.Item>用户管理</Breadcrumb.Item>
  </Breadcrumb>
        <Button
            type="primary"
            style={{marginRight:10}}
            onClick={this.showAddLayer}
          >
            添加
          </Button>
          <Button
            type="primary"
            onClick={this.handleDelete}
            disabled={!this.props.userlist.selRowKeys.length>0}
            loading={this.props.userlist.loading}
            style={{marginRight:10}}
          >
            删除
          </Button>
          <Search 
      placeholder="输入用户名/姓名"
      onSearch={this.querySearchList}
      style={{ width: 200 }}
      enterButton={true}
    />
        </div>
        <Table 
        rowKey="userId"
         rowSelection={this.rowSelection} columns={this.columns} dataSource={this.props.userlist.data} />
         <AddUser />
         <UpdateUser />
      </div>
    );
  }
}
function usersFun(userlist) {
  return userlist;
}
// export default Lists;
export default connect(usersFun)(UserManagement);