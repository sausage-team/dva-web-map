//社区查询
import React from 'react';
import { connect, dispatch } from 'dva';
import styles from './AreaSpecialMap.css';
import Mapbox from '../../components/Map/Mapbox/Mapbox';
import MapPublic from '../../components/Map/MapController/MapPublic'
class AreaSpecialMap extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let map = this.props.map.mapObj;
        this.props.map.mapObj.setStyle(this.props.map.style1);
        this.props.dispatch({
            type: 'mapPublic/setStyleValue',
            payload: ['白天']
        })
        map.on('load', () => {
            this.props.dispatch({
                type: 'map/getAreaSpecia',
                payload: {
                    mapObj: map,
                    value: 0
                }
            })
        })
    }
    render() {
        return (
            <div className={styles.mainBox}>
                <Mapbox />
                <div className={styles.rightTop}>
                    <MapPublic />
                </div>
            </div>
        );
    }
}
function areaSpecialMapFun({ map, areaSpecialMap }) {
    return { map, areaSpecialMap };
}
export default connect(areaSpecialMapFun)(AreaSpecialMap);