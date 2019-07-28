import { getHotMap, Update } from '../services/user';
import gltf from '../../public/Venders/model.gltf';
import gltf1 from '../../public/Venders/qingji.gltf';
import { apiService } from '../services/config'
export default {
  namespace: 'flightPathManagement',
  state: {
    updatastate: {
      name: 'file',
      action: apiService + 'sm/camera/excel?token=' + localStorage.getItem('token') + ''
    },
    updata: '',
    model: false,
    smlibtileData: '',
    viewshed3D: '',
    dataCenter: {
      address: "",
      cameraCode: "",
      cameraType: "",
      cameraid: "",
      indexes: "",
      isControl: "",
      lightRelation: "",
      matrixNum: "",
      name: "",
      smTbName: null,
      smid: '',
      smlibtileid: '',
      smuserid: '',
      smx: '',
      smy: '',
      smz: '',
      videoType: ""
    },
    visible: false,
    flightTab: false,
    flightTabState: false,
    XYZData: false,
  },
  reducers: {
    setViewshed3D(state, { payload: viewshed3D }) {
      state.viewshed3D = viewshed3D;
      return { ...state, };
    },
    setUpdata(state, { payload: updata }) {
      state.updata = updata;
      return { ...state, };
    },
    setModel(state, { payload: model }) {
      state.model = model;
      return { ...state, };
    },
    setSmlibtileData(state, { payload: smlibtileData }) {
      state.smlibtileData = smlibtileData;
      return { ...state, };
    },
    setDataCenter(state, { payload: dataCenter }) {
      state.dataCenter = dataCenter;
      return { ...state, };
    },
    setVisible(state, { payload: visible }) {
      state.visible = visible;
      return { ...state, };
    },
    setFlightTab(state, { payload: flightTab }) {
      state.flightTab = flightTab;
      return { ...state, };
    },
    setFlightTabState(state, { payload: flightTabState }) {
      state.flightTabState = flightTabState;
      return { ...state, };
    },
    setXYZData(state, { payload: XYZData }) {
      state.XYZData = XYZData;
      return { ...state, };
    },
  },
  effects: {
    *getVideoData({ payload: mapObj }, { call, put, select }) {
      let data = yield call(getHotMap, 'sm/camera/queryCameraList?pageNum=1&pageSize=10000', {});
      yield put({
        type: 'setSmlibtileData',
        payload: data.data
      })
      yield put({
        type: 'threeDemo',
        payload: data.data
      })
    },
    *threeDemo({ payload: data }, { call, put, select }) {
      let cesium = yield select(state => state.cesium);
      let cesiumObj = cesium.cesiumObj;
      function getColorBlendMode(colorBlendMode) {
        return Cesium.ColorBlendMode[colorBlendMode.toUpperCase()];
      }

      function getColor(colorName, alpha) {
        var color = Cesium.Color['Red'.toUpperCase()];
        return Cesium.Color.fromAlpha(Cesium.Color['Red'.toUpperCase()], parseFloat(1));
      }
      var viewModel = {
        color: 'Red',
        colors: ['White', 'Red', 'Green', 'Blue', 'Yellow', 'Gray'],
        alpha: 1.0,
        colorBlendMode: 'Highlight',
        colorBlendModes: ['Highlight', 'Replace', 'Mix'],
        colorBlendAmount: 0.5,
        colorBlendAmountEnabled: false,
        silhouetteColor: 'Red',
        silhouetteColors: ['Red', 'Green', 'Blue', 'Yellow', 'Gray'],
        silhouetteAlpha: 1.0,
        silhouetteSize: 2.0
      };
      console.log(data.list)
      for (let i in data.list) {
        let position = Cesium.Cartesian3.fromDegrees(data.list[i].smx, data.list[i].smy, data.list[i].smh);
        let heading = Cesium.Math.toRadians(data.list[i].azimuth);
        let pitch =0;
        let roll = 0;
        let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
        let modelobj = gltf;
        if (data.list[i].cameraType == '枪机') {
          modelobj = gltf1;
        }
        let entity = cesiumObj.entities.add({
          name: data.list[i].indexes,
          position: position,
          orientation: orientation,
          model: {
            uri: modelobj,
            //heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
            minimumPixelSize: 40,
            maximumScale: 400,
            // color :Cesium.Color.fromAlpha(Cesium.Color['Red'.toUpperCase()], parseFloat(1)),
            // colorBlendMode : Cesium.ColorBlendMode['Highlight'.toUpperCase()],
            // colorBlendAmount : parseFloat(0.5),
            // silhouetteColor : Cesium.Color.fromAlpha(Cesium.Color['Red'.toUpperCase()], parseFloat(1)),
            // silhouetteSize : parseFloat(1.0)
          }
        });
      }
      // cesiumObj.trackedEntity = entity;
    },
    *caseUpData({ payload: obj }, { call, put, select }) {

    },
    *setUp({ payload: obj }, { call, put, select }) {
      let cesium = yield select(state => state.cesium);
      let cesiumObj = cesium.cesiumObj;
      // let upData = JSON.stringify(obj);
      cesiumObj.entities.removeAll()
      let data = yield call(Update, `sm/camera/update/${obj.indexes}`, obj);
      console.log(data)
      if (data.code == 0) {
        yield put({
          type: 'getVideoData',
          payload: data.data
        })
        yield put({
          type: 'setVisible',
          payload: false
        })
      }
    },
    *delet({ payload: indexes }, { call, put, select }) {
      let cesium = yield select(state => state.cesium);
      let cesiumObj = cesium.cesiumObj;
      cesiumObj.entities.removeAll()
      let data = yield call(Update, `sm/camera/delete/${indexes}`, "");
      if (data.code == 0) {
        yield put({
          type: 'getVideoData',
          payload: data.data
        })
      }
    }
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen((location) => {
    //     if (location.pathname === '/FlightPathManagement') {
    //       dispatch({ type: 'getVideoData' });
    //     }
    //   })
    // },
  },
};
