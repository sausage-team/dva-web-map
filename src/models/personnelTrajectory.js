import { getHotMap } from '../services/user';
import img from '../../public/img/defalutImg.png'
export default {
  namespace: 'personnelTrajectory',
  state: {
    time: 0,
    timeState: false,
    endTime: 86400,
    stateTime: 50,
    marks: 0,
    timeOut: '',
    timeFun: '',
    witchData: false,
    policeObj: {
      policeNo: '',
      beginTime: '',
      endTime: '',
      parsePattern: 'yyyy-MM-dd HH:mm:ss'
    },
    pointData: '',
    glowingLine: '',
    inputValue: '请输入警员编号',
    switchData: false
  },
  reducers: {
    setTime(state, { payload: time }) {
      state.time = time;
      return { ...state, };
    },
    setTimeState(state, { payload: timeState }) {
      state.timeState = timeState;
      return { ...state, };
    },
    setEndTime(state, { payload: endTime }) {
      state.endTime = endTime;
      return { ...state, };
    },
    setStateTime(state, { payload: stateTime }) {
      state.stateTime = stateTime;
      return { ...state, };
    },
    setMarks(state, { payload: marks }) {
      state.marks = marks;
      return { ...state, };
    },
    setTimeOut(state, { payload: timeOut }) {
      state.timeOut = timeOut;
      return { ...state, };
    },
    setTimeFun(state, { payload: timeFun }) {
      state.timeFun = timeFun;
      return { ...state, };
    },
    setWitchData(state, { payload: witchData }) {
      state.witchData = witchData;
      return { ...state, };
    },
    setPoliceObj(state, { payload: policeObj }) {
      state.policeObj = policeObj;
      return { ...state, };
    },
    setPointData(state, { payload: pointData }) {
      state.pointData = pointData;
      return { ...state, };
    },
    setGlowingLine(state, { payload: glowingLine }) {
      state.glowingLine = glowingLine;
      return { ...state, };
    },
    setInputValue(state, { payload: inputValue }) {
      state.inputValue = inputValue;
      return { ...state, };
    },
    setSwitchData(state, { payload: switchData }) {
      state.switchData = switchData;
      return { ...state, };
    },
  },
  effects: {
    *setTimeOpen(payload, { call, select }) {
      let map = yield select(state => state.personnelTrajectory);
      yield call(map.timeFun)
    },
    *shutTimeOpen(payload, { put, select }) {
      let map = yield select(state => state.personnelTrajectory);
      if (map.timeOut) {
        clearInterval(map.timeOut);
        yield put({
          type: 'setTimeOut',
          payload: ''
        })
        yield put({
          type: 'setTimeState',
          payload: false
        })
      }
    },
    *getPoliceRoute(payload, { call, put, select }) {
      let map = yield select(state => state.personnelTrajectory);
      let policeObj = map.policeObj;
      let switchData = map.switchData;
      let data = ''
      if (switchData) {
        data = yield call(getHotMap, `xk/3d/queryCarRoute/${policeObj.policeNo}/${policeObj.beginTime}/${policeObj.endTime}?parsePattern=${policeObj.parsePattern}`, {})
      } else {
        data = yield call(getHotMap, `xk/3d/queryPoliceRoute/${policeObj.policeNo}/${policeObj.beginTime}/${policeObj.endTime}?parsePattern=${policeObj.parsePattern}`, {})
      }
      if (data.code == 0) {
        let routeData = data.data;
        let LineData = [];
        let pointData = [];
        if (routeData[0]) {
          for (let i in routeData) {
            let time = new Date(routeData[i].createtime);
            let h = time.getHours();
            let m = time.getMinutes();
            let s = time.getSeconds();
            let num = h * 3600 + m * 60 + s;
            let obj = []
            obj.push(parseFloat(routeData[i].longitude))
            obj.push(parseFloat(routeData[i].latitude))
            obj.push(parseInt(routeData[i].altitude))
            obj.push(parseFloat(routeData[i].bearing))
            obj.push(num)
            obj.push(routeData[i].username)
            LineData.push(parseFloat(routeData[i].longitude))
            LineData.push(parseFloat(routeData[i].latitude))
            LineData.push(parseInt(routeData[i].altitude))
            pointData.push(obj)
          }
          let time = new Date(routeData[0].createtime);
          let h = time.getHours();
          let m = time.getMinutes();
          let s = time.getSeconds();
          let num = h * 3600 + m * 60 + s;
          yield put({
            type: 'setTime',
            payload: num
          })
          yield put({
            type: 'poinMap',
            payload: LineData
          })
          yield put({
            type: 'setPointData',
            payload: pointData
          })
          console.log(h, m, s, num)
          yield put({
            type: 'setWitchData',
            payload: true
          })
          yield put({ type: 'setTimeOpen' })
        }
      }
    },
    *lineMap({ payload: data }, { select }) {
      let cesium = yield select(state => state.cesium);
      let viewer = cesium.cesiumObj;
      // var glowingLine =
      viewer.entities.add({
        name: 'Line',
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(data),
          width: 10,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.2,
            color: Cesium.Color.BLUE
          })
        }
      });
    },
    *pointMap({ payload: time }, { put, select }) {
      let cesium = yield select(state => state.cesium);
      let personnelTrajectory = yield select(state => state.personnelTrajectory);
      let viewer = cesium.cesiumObj;
      let switchData = personnelTrajectory.switchData;
      let pointData = personnelTrajectory.pointData;
      let glowingLine = personnelTrajectory.glowingLine;
      if (glowingLine) {
        viewer.entities.remove(glowingLine);
      }
      for (let i in pointData) {
        let xTime = time - 20;
        if (xTime < pointData[i][4] && pointData[i][4] <= time) {
          if (switchData) {
            // glowingLine=viewer.entities.add({
            //   position : Cesium.Cartesian3.fromDegrees(pointData[i][0],pointData[i][1],pointData[i][2]),
            //   billboard : {
            //     image : img,
            //     width : 30,
            //     height : 30
            //   },
            //   label : {
            //     text : pointData[i][5],
            //     font : '14pt monospace',
            //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            //     outlineWidth : 1,
            //     verticalOrigin : Cesium.VerticalOrigin.TOP,
            //     pixelOffset : new Cesium.Cartesian2(0, -43)
            //   }
            // });
          } else {
            glowingLine = viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(pointData[i][0], pointData[i][1], pointData[i][2]),
              billboard: {
                image: img,
                width: 30,
                height: 30
              },
              label: {
                text: pointData[i][5],
                font: '14pt monospace',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 1,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(0, -43)
              }
            });
          }
          yield put({
            type: 'setGlowingLine',
            payload: glowingLine
          })
          break;
        }
      }
    },
  },
  subscriptions: {},
};
