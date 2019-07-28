import React from 'react';
import { connect } from 'dva';
import styles from './Error.less'
import { Icon } from 'antd';

const Error = () => (<div className="content-inner">
  <div className={styles.error}>
    <Icon type="frown-o" />
    <h1>404 Not Found</h1>
  </div>
</div>)

export default Error

