import React from 'react'
import classNames from 'classnames'
import styles from './Loader.less'
import { connect } from 'dva';
// const Loader = ({ spinning, fullScreen }) => {
//   return (<div  className={classNames(styles.loader, {
//     [styles.hidden]: !spinning,
//     [styles.fullScreen]: fullScreen,
//   })}
//   >
//     <div style={{display:spinning?'block':'span'}} className={styles.warpper}>
//       <div className={styles.inner} />
//       <div className={styles.text} >江岸区公安局{spinning}</div>
//     </div>
//   </div>)
// }

class Loader extends React.Component { 
  constructor(props) {
    super(props);
  }
  render() {
    return (<div className={classNames(styles.loader, {
      // [styles.hidden]: !this.props.map.loading,
      [styles.hidden]: !this.props.spicnning,
      [styles.fullScreen]: this.props.fullScreen,
    })}
    >
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