import React from 'react';
import { connect } from 'dva';
import styles from './MapController.css';
import { Tabs, Icon, DatePicker, Button, Switch, Radio } from 'antd';
import moment from 'moment';
import img1 from '../../../../public/img/tubiao1.png';
import img2 from '../../../../public/img/tubiao2.png';
import img3 from '../../../../public/img/tubiao3.png';
import img4 from '../../../../public/img/tubiao4.png';
import { FlyToInterpolator } from 'react-map-gl';
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class MapControllerThree extends React.Component {
    constructor(props) {
        super(props);
    }
    // disabledStartDate = (startValue) => {
    //     const endValue = this.props.map.endValue;
    //     if (!startValue || !endValue) {
    //         return false;
    //     }
    //     return startValue.valueOf() > endValue.valueOf();
    // }

    // disabledEndDate = (endValue) => {
    //     const startValue = this.props.map.startValue;
    //     if (!endValue || !startValue) {
    //         return false;
    //     }
    //     return endValue.valueOf() <= startValue.valueOf();
    // }
    //开始时间
    // onStartChange = (value, dateString) => {
    //     this.props.dispatch({
    //         type: 'map/setStatesTime',
    //         payload: dateString
    //     })
    //     this.props.dispatch({
    //         type: 'map/setstartValue',
    //         payload: value
    //     })
    // }
    //结束时间
    // onEndChange = (value, dateString) => {
    //     this.props.dispatch({
    //         type: 'map/setEndsTime',
    //         payload: dateString
    //     })
    //     this.props.dispatch({
    //         type: 'map/setendValue',
    //         payload: value
    //     })
    // }
    // handleStartOpenChange = (open) => {
    //     if (!open) {
    //         this.props.dispatch({
    //             type: 'map/setendOpen',
    //             payload: true
    //         })
    //     }
    // }
    // handleEndOpenChange = (open) => {
    //     this.props.dispatch({
    //         type: 'map/setendOpen',
    //         payload: open
    //     })
    // }
    tabFun = (key) => {
        switch (key) {
            case '1':
                // this.props.dispatch({
                //     type: 'map/getSpecialMap',
                //     payload: { value: 1, mapObj: this.props.map.mapReactObj }
                // })
                // this.goToViewport(10, 0);
                break;
            case '2':
                this.props.dispatch({
                    type: 'map/getHotMapThree',
                    payload: this.props.map.mapReactObj
                })
                this.goToViewport(12, 0, 114.3038583200, 30.6479700100);
                break;
            case '3':
                switch (this.props.map.groupData || 'a') {
                    case 'a':
                        this.props.dispatch({
                            type: 'map/getCustersMapThree',
                            payload: this.props.map.mapReactObj
                        })
                        this.goToViewport(13, 0, 114.3038583200, 30.6479700100);
                        break;
                    case 'b':
                        // this.props.dispatch({
                        //     type: 'map/GridMapDate',
                        //     payload: this.props.map.mapReactObj
                        // })
                        // this.goToViewport(10, 0);
                        break;
                    case 'c':
                        this.props.dispatch({
                            type: 'map/getHoneycombThree',
                            payload: this.props.map.mapReactObj
                        })
                        this.goToViewport(13, 0, 114.3038583200, 30.6479700100);
                        break;
                }
                break;
            case '4':
                this.props.dispatch({ type: 'map/getDackMapThree' })
                this.goToViewport(11.5, 60, 114.3038583200, 30.6479700100);
                break;
        }
    }
    goToViewport = (zoom, pitch, x, y) => {
        let viewport = {
            // longitude: x || 115.78452,
            // latitude: y || 39.99631,
            longitude: x || 114.3038583200,
            latitude: y || 30.6479700100,
            zoom: zoom,
            pitch: pitch,
            bearing: 0,
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: 1500
        }
        this.props.dispatch({
            type: 'map/viewportChange',
            payload: viewport
        })
    };
    radioChang = (e) => {
        let groupData = e.target.value;
        this.props.dispatch({
            type: 'map/setGroupData',
            payload: groupData
        })
        switch (e.target.value) {
            case 'a':
                this.props.dispatch({
                    type: 'map/getCustersMapThree',
                    payload: this.props.map.mapReactObj
                })
                this.goToViewport(11, 0, 114.3038583200, 30.6479700100);
                break;
            case 'b':
                // this.props.dispatch({
                //     type: 'map/GridMapDate',
                //     payload: this.props.map.mapReactObj
                // })
                // this.goToViewport(10.5, 0);
                break;
            case 'c':
                this.props.dispatch({
                    type: 'map/getHoneycombThree',
                    payload: this.props.map.mapReactObj
                })
                break;
        }
    }
    switchChenge = (checked) => {
        console.log(checked)
        this.props.dispatch({
            type: 'cameraManagement/setMapDataState',
            payload: checked
        })
    }
    // btnClick = (value) => {
    //     this.props.dispatch({
    //         type: 'map/getSpecialMap',
    //         payload: { value: value, mapObj: this.props.map.mapReactObj }
    //     })
    // }
    render() {
        // const { startValue, endValue, endOpen } = this.props.map;
        return (
            <div className={styles.main}>
                <h2 className={styles.hTwo}>图表类型 <Switch style={{ marginTop: '10px', float: 'right' }} checkedChildren="实有人口" unCheckedChildren="重点人口" checked={this.props.cameraManagement.mapDataState} defaultChecked onChange={this.switchChenge} /></h2>
                <Tabs type="line" tabBarStyle={{ margin: 0, padding: '0', }} onChange={this.tabFun} forceRender={true}>
                    {/* <TabPane tab={<div className={styles.tab}><img src={img1} /></div>} key="1">
                        <h2 className={styles.hTwo}>日期</h2>
                        <div className={styles.center}>
                            <h3 className={styles.hTherr}>开始日期</h3>
                            <DatePicker
                                disabledDate={this.disabledStartDate}
                                format="YYYY-MM-DD"
                                defaultValue={moment('2017-01-01', 'YYYY-MM-DD')}
                                placeholder="开始时间"
                                onChange={this.onStartChange}
                                onOpenChange={this.handleStartOpenChange}
                                showToday={false}
                                style={{ width: '280px', height: '30px', color: '#fff', background: 'rgba(255,255,255,0)' }}
                            />
                            <h3 className={styles.hTherr}>结束日期</h3>
                            <DatePicker
                                disabledDate={this.disabledEndDate}
                                format="YYYY-MM-DD"
                                defaultValue={moment('2017-12-31', 'YYYY-MM-DD')}
                                placeholder="结束时间"
                                onChange={this.onEndChange}
                                open={endOpen}
                                onOpenChange={this.handleEndOpenChange}
                                showToday={false}
                                style={{ width: '280px', height: '30px', color: '#fff', background: 'rgba(255,255,255,0)' }}
                            />
                        </div>
                        <h2 className={styles.borderTop}>专题分段设置</h2>
                        <div className={styles.center}>
                            <Button type="primary" style={{ marginLeft: '14px', marginTop: '20px' }} onClick={this.btnClick.bind(this, 1)}>均值分段</Button>
                            <Button type="primary" style={{ marginLeft: '14px', marginTop: '20px' }} onClick={this.btnClick.bind(this, 2)}>分位数分段</Button>
                        </div>
                    </TabPane> */}
                    <TabPane tab={<div className={styles.tab}><img src={img2} /></div>} key="2">
                        {/* <h2 className={styles.hTwo}>时间轴</h2>
                        <div className={styles.center}>
                            <Switch style={{ marginTop: '20px' }} checkedChildren="显示" unCheckedChildren="关闭" checked={this.props.map.witchData} defaultChecked onChange={this.switchChenge} />
                        </div> */}
                    </TabPane>
                    <TabPane tab={<div className={styles.tab}><img src={img3} /></div>} key="3">
                        <h2 className={styles.hTwo}>聚合方式</h2>
                        <div className={styles.center}>
                            <RadioGroup style={{ marginTop: '20px' }} defaultValue="a" size="large" onChange={this.radioChang}>
                                <RadioButton value="a">&nbsp;&nbsp;圆&nbsp;&nbsp;</RadioButton>
                                {/* <RadioButton value="b">网&nbsp;格</RadioButton> */}
                                <RadioButton value="c">蜂&nbsp;巢</RadioButton>
                            </RadioGroup>
                        </div>
                        {/* <h2 className={styles.hTwo}>时间轴</h2>
                        <div className={styles.center}>
                            <Switch style={{ marginTop: '20px' }} checkedChildren="显示" unCheckedChildren="关闭" checked={this.props.map.witchData} defaultChecked onChange={this.switchChenge} />
                        </div> */}
                    </TabPane>
                    <TabPane tab={<div className={styles.tab}><img src={img4} /></div>} key="4">
                        {/* <h2 className={styles.hTwo}>时间轴</h2>
                        <div className={styles.center}>
                            <Switch style={{ marginTop: '20px' }} checkedChildren="显示" unCheckedChildren="关闭" checked={this.props.map.witchData} defaultChecked onChange={this.switchChenge} />
                        </div> */}
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
function MapControllerFun({ map, cameraManagement }) {
    return { map, cameraManagement };
}
export default connect(MapControllerFun)(MapControllerThree);
