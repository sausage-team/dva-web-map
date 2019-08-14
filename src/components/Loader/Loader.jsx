import React from 'react'
import classNames from 'classnames'
import styles from './Loader.less'
import { connect } from 'dva'

class Loader extends React.Component { 
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={
        classNames(styles.loader, 
          {
            [styles.hidden]: !this.props.spicnning,
            [styles.fullScreen]: this.props.fullScreen,
          })
        }>
      <div className={styles.warpper}>
        <div className={styles.inner} />
        <div className={styles.text} >江岸区公安局</div>
      </div>
    </div>)
  }
}

function loaderModel({ map }) {
  return { map };
}
export default connect(loaderModel)(Loader);