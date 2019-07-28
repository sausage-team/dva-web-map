import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import styles from './NuclearDensityAnalysis.css';
import Mapbox from '../../../components/Map/Mapbox/Mapbox'
import Slider from '../../../components/Slider/Slider'
import MapGL from '../../../components/Map/MapGL/ReactMap'
import DackLayer from '../../../components/Map/DackGL/DackLayer'
import MapController from '../../../components/Map/MapController/MapController'
class NuclearDensityAnalysis extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    //this.props.map.mapObj.setStyle(this.props.map.style2);
    //this.props.dispatch({ type: 'map/getDackData' })
  }
  render() {
    return (
      <div className={styles.mainIndex}>
        <div className={styles.MapController}>
          <MapController />
        </div>
        <MapGL >
          {this.props.map.deck ? <DackLayer /> : ""}
        </MapGL>
        {this.props.map.timeShowState ? <div>
          {this.props.map.witchData ? <div className={styles.slider}>
            <Slider />
          </div> : ""}
        </div> : ""}
      </div>
    );
  }
}
function NuclearDensityAnalysisFun({ map }) {
  return { map };
}
export default connect(NuclearDensityAnalysisFun)(NuclearDensityAnalysis);