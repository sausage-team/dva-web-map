import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import styles from './CaseEditor.css';
import Mapbox from '../../components/Map/Mapbox/Mapbox'
import Slider from '../../components/Slider/Slider'
import UpData from '../../components/Updata/Updata'
class CaseEditor extends React.Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.map.mapObj.setStyle(this.props.map.style2);
  }
  render() {
    return (
      <div className={styles.mainIndex}>
        <div className={styles.updata}>
          <UpData />
        </div>
        <Mapbox />
        <div className={styles.slider}>
          <Slider />
        </div>
      </div>
    );
  }
}
function CaseEditorFun({ map }) {
  return { map };
}
export default connect(CaseEditorFun)(CaseEditor);
