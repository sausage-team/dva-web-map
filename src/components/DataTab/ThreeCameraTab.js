import React from 'react';
import styles from './DataTab.css';
import { connect } from 'dva';
import { Tabs, Radio, Table, Icon, Divider } from 'antd';
class ThreeCameraTab extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '警员编号',
      key: 'username',
      dataIndex: 'username',
    }, {
      title: '姓名',
      key: 'name',
      dataIndex: 'name'
    }, {
      title: '所属派出所',
      key: 'station',
      dataIndex: 'station'
    }, {
      title: '联系方式',
      key: 'mobile',
      dataIndex: 'mobile'
    }];
  }
  render() {
    return (
        <Table columns={this.columns} pagination={false} bordered loading={this.props.threeCameraManagement.loading} dataSource={this.props.threeCameraManagement.columns} size='middle' />
    )
  }
}
function ThreeCameraTabModel({ threeCameraManagement}) {
  return { threeCameraManagement};
}
export default connect(ThreeCameraTabModel)(ThreeCameraTab);
