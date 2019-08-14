import React from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
class TrajectoryTab extends React.Component {
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
        <Table columns={this.columns} pagination={false} bordered loading={this.props.trajectoryBrowsing.loading} dataSource={this.props.trajectoryBrowsing.columns} size='middle' />
    )
  }
}
function TrajectoryTabModel({ trajectoryBrowsing}) {
  return { trajectoryBrowsing};
}
export default connect(TrajectoryTabModel)(TrajectoryTab);
