import { Table,Breadcrumb} from 'antd';
import styles from './RoleManagement.css';
import { connect,dispatch } from 'dva';
const columns=[
    {
        title: '序号',
        dataIndex: 'rolenum',
        key: 'rolenum',
        render:(text,record,index)=>{
            return index+1;
        }
      },{
    title: '角色名称',
    dataIndex: 'roleName',
    key: 'roleName',
  }, {
    title: '角色描述',
    dataIndex: 'remark',
    key: 'remark',
    render:(text,record,index)=>{
        return <a href="#">{text}</a>;
    }
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  }];
  class UserRoleManagement extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
        return (
          <div className={styles.mainBox}>
            <div style={{ marginBottom: 16 }}>
             <Breadcrumb style={{marginBottom:10}}>
             <Breadcrumb.Item>Home</Breadcrumb.Item>
             <Breadcrumb.Item>角色管理</Breadcrumb.Item>
             </Breadcrumb>
            </div>
            <Table 
            rowKey="roleId" columns={columns} dataSource={this.props.userrole.data} />
          </div>
        );
      }
  }
  function usersFun(userrole) {
    return userrole;
  }
  // export default Lists;
  export default connect(usersFun)(UserRoleManagement);