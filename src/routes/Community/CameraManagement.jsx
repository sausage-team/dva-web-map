import React from 'react';
import { connect } from 'dva';
import styles from './CameraManagement.css';
import MapGL from '../../components/Map/MapGL/ReactMap';
import DackLayerTwo from '../../components/Map/DackGL/DackLayerTwo';
import MapControllerTwo from '../../components/Map/MapController/MapControllerTwo';
class CameraManagement extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // this.props.map.mapObj.setStyle(this.props.map.style2);
        //this.props.dispatch({ type: 'map/getDackData' })
    }
    render() {
        return (
            <div className={styles.mainIndex}>
                <div className={styles.MapController}>
                    <MapControllerTwo />
                </div>
                <MapGL >
                    {this.props.map.deck ? <DackLayerTwo /> : ""}
                </MapGL>
            </div>
        );
    }
}
function CameraManagementFun({ map, cameraManagement }) {
    return { map, cameraManagement };
}
export default connect(CameraManagementFun)(CameraManagement);
