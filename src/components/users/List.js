import React, {PropTypes} from "react";
import {Table, Pagination, Row, Button, Popconfirm} from "antd";
import styles from "./List.less";

function list({
  loading,
  dataSource,
  onPageChange,
  onDelete,
  onEdit,
  total = 1,
  current = 0,
  pageSize = 20,
}) {
  const newColumns =

    [
      {
        key: 'service',
        dataIndex: 'service',
        title: '服务器'
      },
      {
        key:'ips',
        dataInex: 'ips',
        title:'IP',
        render:(text, record, index)=><div>{
          record && record.ips ?record.ips.reduce((a,b)=>a+',  '+b):''
        }</div>
      },
      {
        key: 'operate',
        dataIndex: 'operate',
        title: '操作',
        render: (text, record, indexx) => (<div>
          <Row type="flex" justify="space-around">
            <Button type="primary" onClick={() => (onEdit(record))}>编辑</Button>
            <Popconfirm title='确定要删除吗？' onConfirm={() => onDelete(record.id)}>
              <Button type="primary">删除</Button>
            </Popconfirm>
          </Row>

        </div>)
      }
    ];

  function pageChangeHandler(page) {
    onPageChange({current: page, size: pageSize})
  }

  return (
    <div>
      <Table
        className={styles.table}
        bordered
        columns={newColumns}
        dataSource={dataSource}
        loading={loading}
        onChange={onPageChange}
        pagination={false}
        simple
        rowKey={record => record.id}
      />
      <Row>
        <Pagination
          className="ant-table-pagination"
          total={total}
          current={current}
          pageSize={pageSize}
          onChange={pageChangeHandler}
        />
      </Row>
    </div>
  )
}

list.propTypes = {
  onPageChange: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  dataSource: PropTypes.array,
  loading: PropTypes.any,
  pagination: PropTypes.any,
}

export default list