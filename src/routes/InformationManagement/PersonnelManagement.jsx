import React from 'react';
import { connect } from 'dva';
import styles from './PersonnelManagement.css';
import MapGL from '../../components/Map/MapGL/ReactMap';
import DackLayerTwo from '../../components/Map/DackGL/DackLayerTwo';
import MapControllerThree from '../../components/Map/MapController/MapControllerThree';
class PersonnelManagement extends React.Component {
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
                    <MapControllerThree />
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
export default connect(CameraManagementFun)(PersonnelManagement);
