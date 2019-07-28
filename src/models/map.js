import HotMap from '../components/Map/MapLayer/HotMap';
import { getHotMap } from '../services/user';
import CustersMap from '../components/Map/MapLayer/CustersMap'
import GridMap from '../components/Map/MapLayer/GridMap';
import SpecialMap from '../components/Map/MapLayer/SpecialMap';
import PavementMap from '../components/Map/MapLayer/PavementMap';
import HexGridMap from '../components/Map/MapLayer/HexGridMap';
import SectionMap from '../components/Map/MapLayer/SectionMap';
import IntersectionMap from '../components/Map/MapLayer/IntersectionMap';
import IntersectionHotMap from '../components/Map/MapLayer/IntersectionHotMap';
import CameraMap from '../components/Map/MapLayer/CameraMap';
import CaseMap from '../components/Map/MapLayer/CaseMap';
import Honeycomb from '../components/Map/MapLayer/Honeycomb';
import HoneycombTwo from '../components/Map/MapLayer/HoneycombTwo';
import moment from 'moment';
import SectionHotMap from '../components/Map/MapLayer/SectionHotMap';
import AreaMap from '../components/Map/MapLayer/AreaMap';
import TSMap from '../components/Map/MapLayer/TSMap';
import TSHotMap from '../components/Map/MapLayer/TSHotMap';
import KernelMap from '../components/Map/MapLayer/KernelMap';
import HotMapTwo from '../components/Map/MapLayer/HotMapTwo';
import CustersMapTwo from '../components/Map/MapLayer/CustersMapTwo';
import { ThreeServerApi } from '../services/config';
// import data0 from '../../public/0.json'
export default {
  namespace: 'map',
  state: {
    accessToken: 'pk.eyJ1IjoibGl1eGluZ2RvbmciLCJhIjoiY2o3YWZpbXRhMGJkazJxbnpyMmtuaG8zcyJ9.aETxR-kkDby57dNqp_TvNw',
    mapObj: '',
    mapReactObj: '',
    // style1:'http://localhost:8090/iserver/services/map-mvt-WanShang/rest/maps/晚上/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true',
    // style2:'http://localhost:8090/iserver/services/map-mvt-WanShang/rest/maps/晚上/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true',
    // style2: `${ThreeServerApi}map-mvt-wuhan/rest/maps/wuhan/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true`,
    // style1: `${ThreeServerApi}map-mvt-wuhan/rest/maps/wuhan/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true`,
    style2: `${ThreeServerApi}map-mvt-mtgWPYdarkpoi/rest/maps/mtgWPY_dark_poi/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true`,
    style1: `${ThreeServerApi}map-mvt-mtgWPYdarkpoi/rest/maps/mtgWPY_dark_poi/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true`,
    mapstate: {
      container: 'map',
      style: `${ThreeServerApi}map-mvt-mtgWPYdarkpoi/rest/maps/mtgWPY_dark_poi/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true`,
      // style: `${ThreeServerApi}map-mvt-wuhan/rest/maps/wuhan/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true`,
      // style:'http://192.168.12.100:8090/iserver/services/map-mvt-BaiTian/rest/maps/白天/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true',
      attributionControl: false,
      zoom: 10,
      center: [116.389522, 39.913692],
      maxZoom: 19,
      minZoom: 10
    },
    endTime: 8760,
    time: 0,
    stateTime: 100,
    timeOut: '',
    timeFun: '',
    //保存各个图层的方法
    hotMap: '',
    custersMap: '',
    gridMap: '',
    pavementMap: '',
    sectionMap: '',
    intersectionMap: '',
    timeState: false,
    marks: 0,
    drawObj: '',
    viewport: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      longitude: 116.389522,
      latitude: 39.913692,
      zoom: 11,
      minZoom: 10,
      maxZoom: 18,
      pitch: 45
    },
    dackData: "",
    dackList: '',
    deck: false,
    startValue: null,
    endValue: null,
    statesTime: '2017-01-01',
    endsTime: '2017-12-31',
    endOpen: false,
    //保存图层的刷新函数
    hotMapObj: "",
    custersMapObj: "",
    gridMapObj: "",
    specialMapObj: "",
    intersectionMapObj: '',
    pavementMapObj: '',
    sectionMapObj: '',
    groupData: '',
    witchData: false,
    mapTab: 1,
    timeShowState: false
  },
  reducers: {
    setTimeShowState(state, { payload: timeShowState }) {
      state.timeShowState = timeShowState;
      return { ...state, };
    },
    setStatesTime(state, { payload: statesTime }) {
      state.statesTime = statesTime;
      return { ...state, };
    },
    setEndsTime(state, { payload: endsTime }) {
      state.endsTime = endsTime;
      return { ...state, };
    },
    setWitchData(state, { payload: witchData }) {
      state.witchData = witchData;
      return { ...state, };
    },
    setGroupData(state, { payload: groupData }) {
      state.groupData = groupData;
      return { ...state, };
    },
    setendOpen(state, { payload: endOpen }) {
      state.endOpen = endOpen;
      return { ...state, };
    },
    setendValue(state, { payload: endValue }) {
      state.endValue = endValue;
      return { ...state, };
    },
    setstartValue(state, { payload: startValue }) {
      state.startValue = startValue;
      return { ...state, };
    },
    setDrawObj(state, { payload: drawObj }) {
      state.drawObj = drawObj;
      return { ...state, };
    },
    setMarks(state, { payload: marks }) {
      state.marks = marks;
      return { ...state, };
    },
    setMapObj(state, { payload: map }) {
      state.mapObj = map;
      return { ...state, };
    },
    setMapState(state, { payload: num }) {
      state.mapstate.style = state.style2;
      return { ...state, };
    },
    setTime(state, { payload: time }) {
      state.time = time;
      return { ...state };
    },
    setTimeOut(state, { payload: timeOut }) {
      state.timeOut = timeOut;
      return { ...state };
    },
    setTimeFun(state, { payload: timeFun }) {
      state.timeFun = timeFun;
      return { ...state };
    },
    setHotMap(state, { payload: hotMap }) {
      state.hotMap = hotMap;
      return { ...state };
    },
    setGridMap(state, { payload: gridMap }) {
      state.gridMap = gridMap;
      return { ...state };
    },
    gridMapOpen(state, { payload: hotMap }) {
      if (state.gridMap) {
        state.gridMap(state.time);
      }
      return { ...state };
    },
    hotMapOpen(state, { payload: hotMap }) {
      if (state.hotMap) {
        state.hotMap(state.time);
      }
      return { ...state };
    },
    pavementMapOpen(state, { payload: PavementMap }) {
      if (state.pavementMap) {
        state.pavementMap(state.time);
      }
      return { ...state };
    },
    intersectionMapOpen(state, { payload: intersectionMap }) {
      if (state.intersectionMap) {
        state.intersectionMap(state.time);
      }
      return { ...state };
    },
    sectionMapOpen(state, { payload: sectionMap }) {
      if (state.sectionMap) {
        state.sectionMap(state.time);
      }
      return { ...state };
    },
    setCustersMap(state, { payload: custersMap }) {
      state.custersMap = custersMap;
      return { ...state };
    },
    custersMapOpen(state, { payload: custersMap }) {
      if (state.custersMap) {
        state.custersMap(state.time);
      }
      return { ...state };
    },
    setTimeState(state, { payload: timeState }) {
      state.timeState = timeState;
      return { ...state };
    },
    viewportChange(state, { payload: viewport }) {
      state.viewport = { ...state.viewport, ...viewport }
      return { ...state };
    },
    setMapReactObj(state, { payload: mapReactObj }) {
      state.mapReactObj = mapReactObj;
      return { ...state };
    },
    setDackData(state, { payload: dackData }) {
      state.dackData = dackData;
      return { ...state };
    },
    setDackList(state, { payload: dackList }) {
      state.dackList = dackList;
      return { ...state };
    },
    setDeck(state, { payload: deck }) {
      state.deck = deck;
      return { ...state };
    },
    setHotMapObj(state, { payload: hotMapObj }) {
      state.hotMapObj = hotMapObj;
      return { ...state };
    },
    setCustersMapObj(state, { payload: custersMapObj }) {
      state.custersMapObj = custersMapObj;
      return { ...state };
    },
    setGridMapObj(state, { payload: gridMapObj }) {
      state.gridMapObj = gridMapObj;
      return { ...state };
    },
    setSpecialMapObj(state, { payload: specialMapObj }) {
      state.specialMapObj = specialMapObj;
      return { ...state };
    },
    setPavementMapObj(state, { payload: pavementMapObj }) {
      state.pavementMapObj = pavementMapObj;
      return { ...state };
    },
    setSectionMapObj(state, { payload: sectionMapObj }) {
      state.sectionMapObj = sectionMapObj;
      return { ...state };
    },
    setMapTab(state, { payload: mapTab }) {
      state.mapTab = mapTab;
      return { ...state };
    },
    setPavementMap(state, { payload: pavementMap }) {
      state.pavementMap = pavementMap;
      return { ...state };
    },
    setSectionMap(state, { payload: sectionMap }) {
      state.sectionMap = sectionMap;
      return { ...state };
    },
    setIntersectionMap(state, { payload: intersectionMap }) {
      state.intersectionMap = intersectionMap;
      return { ...state };
    },
    setIntersectionMapObj(state, { payload: intersectionMapObj }) {
      state.intersectionMapObj = intersectionMapObj;
      return { ...state };
    },
  },
  effects: {
    *setTimeOpen({ payload }, { call, put, select }) {
      let map = yield select(state => state.map);
      map.timeFun();
      yield put({
        type: 'setTimeShowState',
        payload: true
      })
    },
    *shutTimeOpen({ payload }, { call, put, select }) {
      let map = yield select(state => state.map);
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
    *getHotMapData({ payload: mapObj }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let map = yield select(state => state.map);
      let token = localStorage.getItem('token')
      let hotMapData = yield call(getHotMap, 'sm/case/queryXyListByYear/2017/?token=' + token + '', {});
      hotMapData = hotMapData.data
      let hotMap = new HotMap(mapObj);
      let filterBy = hotMap.filterBy;
      hotMap.addMapLay(hotMapData);
      yield put({
        type: 'setHotMapObj',
        payload: hotMap
      })
      yield put({
        type: 'setHotMap',
        payload: filterBy
      })
      yield put({
        type: 'setTimeOpen'
      })
      yield put({
        type: 'setTimeState',
        payload: true
      })
    },
    *getHotMapTwo({ payload: mapObj }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let cameraManagement = yield select(state => state.cameraManagement);
      let mapDataState = cameraManagement.mapDataState;
      let num = 0;
      if (mapDataState) {
        num = 1
      }
      let hotMapTwoData = yield call(getHotMap, `sm/3d/queryBuildingXy/${num}`, {});
      hotMapTwoData = hotMapTwoData.data;
      let hotMap = new HotMapTwo(mapObj);
      yield call(hotMap.addMapLay, hotMapTwoData);
      yield put({
        type: 'setHotMapObj',
        payload: hotMap
      })
    },
    *getHotMapThree({ payload: mapObj }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let cameraManagement = yield select(state => state.cameraManagement);
      let mapDataState = cameraManagement.mapDataState;
      let num = 0;
      if (mapDataState) {
        num = 1
      }
      let hotMapTwoData = yield call(getHotMap, `sm/3d/queryBuildingPersonXy/${num}`, {});
      //let hotMapTwoData = data0;
      hotMapTwoData = hotMapTwoData.data;
      let hotMap = new HotMapTwo(mapObj);
      yield call(hotMap.addMapLay, hotMapTwoData);
      yield put({
        type: 'setHotMapObj',
        payload: hotMap
      })
    },
    *getHoneycomb({ payload: mapObj }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let token = localStorage.getItem('token')
      let honeycombData = yield call(getHotMap, 'sm/case/queryXyListByYear/2017/?token=' + token + '', {});
      honeycombData = honeycombData.data
      let honeycomb = new Honeycomb(mapObj);
      honeycomb.addMapLay(honeycombData);
      yield put({
        type: 'setHotMapObj',
        payload: honeycomb
      })
    },
    *getHoneycombTwo({ payload: mapObj }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let cameraManagement = yield select(state => state.cameraManagement);
      let mapDataState = cameraManagement.mapDataState;
      let num = 0;
      if (mapDataState) {
        num = 1
      }
      let hotMapTwoData = yield call(getHotMap, `sm/3d/queryBuildingXy/${num}`, {});
      hotMapTwoData = hotMapTwoData.data;
      let honeycombTwo = new HoneycombTwo(mapObj);
      yield call(honeycombTwo.addMapLay, hotMapTwoData);
      yield put({
        type: 'setHotMapObj',
        payload: honeycombTwo
      })
    },
    *getHoneycombThree({ payload: mapObj }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let cameraManagement = yield select(state => state.cameraManagement);
      let mapDataState = cameraManagement.mapDataState;
      let num = 0;
      if (mapDataState) {
        num = 1
      }
      let hotMapTwoData = yield call(getHotMap, `sm/3d/queryBuildingPersonXy/${num}`, {});
      hotMapTwoData = hotMapTwoData.data;
      let honeycombTwo = new HoneycombTwo(mapObj);
      yield call(honeycombTwo.addMapLay, hotMapTwoData);
      yield put({
        type: 'setHotMapObj',
        payload: honeycombTwo
      })
    },
    *custersMapDate({ payload: mapObj }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let map = yield select(state => state.map);
      let token = localStorage.getItem('token')
      let custersMapData = yield call(getHotMap, 'sm/case/queryXyListByYear/2017/?token=' + token + '', {});
      custersMapData = custersMapData.data;
      let custersMap = new CustersMap(mapObj);
      custersMap.addMapLay(custersMapData);
      yield put({
        type: 'setCustersMapObj',
        payload: custersMap
      })
    },
    *getCustersMapTwo({ payload: mapObj }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let cameraManagement = yield select(state => state.cameraManagement);
      let mapDataState = cameraManagement.mapDataState;
      let num = 0;
      if (mapDataState) {
        num = 1
      }
      let custersMapData = yield call(getHotMap, `sm/3d/queryBuildingXy/${num}`, {});
      custersMapData = custersMapData.data;
      let custersMapTwo = new CustersMapTwo(mapObj);
      custersMapTwo.addMapLay(custersMapData);
      yield put({
        type: 'setCustersMapObj',
        payload: custersMapTwo
      })
    },
    *getCustersMapThree({ payload: mapObj }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let cameraManagement = yield select(state => state.cameraManagement);
      let mapDataState = cameraManagement.mapDataState;
      let num = 0;
      if (mapDataState) {
        num = 1
      }
      let custersMapData = yield call(getHotMap, `sm/3d/queryBuildingPersonXy/${num}`, {});
      //let custersMapData = data0
      custersMapData = custersMapData.data;
      let custersMapTwo = new CustersMapTwo(mapObj);
      custersMapTwo.addMapLay(custersMapData);
      yield put({
        type: 'setCustersMapObj',
        payload: custersMapTwo
      })
    },
    *GridMapDate({ payload: mapObj }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let map = yield select(state => state.map);
      let token = localStorage.getItem('token')
      let GridMapData = yield call(getHotMap, '/sm/case/queryWgListByYear/2017/?token=' + token + '', {});
      GridMapData = GridMapData.data;
      let gridMap = new GridMap(mapObj);
      let filterBy = gridMap.filterBy;
      gridMap.addMapLay(GridMapData);
      yield put({
        type: 'setGridMapObj',
        payload: gridMap
      })
      yield put({
        type: 'setGridMap',
        payload: filterBy
      })
      yield put({
        type: 'setTimeOpen'
      })
      yield put({
        type: 'setTimeState',
        payload: true
      })
    },
    *getHexGridMap({ payload: mapObj }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let map = yield select(state => state.map);
      let token = localStorage.getItem('token')
      let GridMapData = yield call(getHotMap, '/sm/case/queryWgListByYear/2017/?token=' + token + '', {});
      GridMapData = GridMapData.data;
      let hexGridMap = new HexGridMap(mapObj);
      let filterBy = hexGridMap.filterBy;
      hexGridMap.addMapLay(GridMapData);
    },
    *getDackData({ payload }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let token = localStorage.getItem('token')
      let hotMapData = yield call(getHotMap, 'sm/case/queryXyListByYear/2017/?token=' + token + '', {});
      yield put({
        type: 'setDackData',
        payload: hotMapData
      })
      yield put({
        type: 'setDeck',
        payload: true
      })
    },
    *getDackMapTwo({ payload }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let cameraManagement = yield select(state => state.cameraManagement);
      let mapDataState = cameraManagement.mapDataState;
      let num = 0;
      if (mapDataState) {
        num = 1
      }
      let custersMapData = yield call(getHotMap, `sm/3d/queryBuildingXy/${num}`, {});
      custersMapData = custersMapData.data;
      yield put({
        type: 'setDackData',
        payload: custersMapData
      })
      yield put({
        type: 'setDeck',
        payload: true
      })
    },
    *getDackMapThree({ payload }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let cameraManagement = yield select(state => state.cameraManagement);
      let mapDataState = cameraManagement.mapDataState;
      let num = 0;
      if (mapDataState) {
        num = 1
      }
      let custersMapData = yield call(getHotMap, `sm/3d/queryBuildingPersonXy/${num}`, {});
      //let custersMapData = data0
      custersMapData = custersMapData.data;
      yield put({
        type: 'setDackData',
        payload: custersMapData
      })
      yield put({
        type: 'setDeck',
        payload: true
      })
    },
    *getSpecialMap({ payload: object }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let map = yield select(state => state.map);
      let mapObj = object.mapObj;
      let token = localStorage.getItem('token')
      let url = 'sm/case/queryXyListByDate';
      url += '/' + moment(map.statesTime, 'YYYY-MM-DD').format('YYYYMMDD') + '/' + moment(map.endsTime, 'YYYY-MM-DD').format('YYYYMMDD')
      let data = yield call(getHotMap, url + '?token=' + token + '', {})
      data = data.data
      let specialMap = new SpecialMap(mapObj);
      yield call(specialMap.addMapLay.bind(this, data, object.value))
      yield put({
        type: 'setSpecialMapObj',
        payload: specialMap
      })
    },
    *getPavementMap({ payload: object }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let mapObj = object.mapObj;
      let token = localStorage.getItem('token')
      let data = yield call(getHotMap, 'sm/case/queryWgfaceByYear/2017?token=' + token + '', {})
      data = data.areaList;
      let pavementMap = new PavementMap(mapObj);
      yield call(pavementMap.addMapLay.bind(this, data, object.value));
      let filterBy = pavementMap.filterBy;
      yield put({
        type: 'setPavementMapObj',
        payload: pavementMap
      })
      yield put({
        type: 'setPavementMap',
        payload: filterBy
      })
      yield put({
        type: 'setTimeOpen'
      })
      yield put({
        type: 'setTimeState',
        payload: true
      })
    },
    *getIntersectionMap({ payload: object }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let mapObj = object.mapObj;
      let token = localStorage.getItem('token')
      let data = yield call(getHotMap, 'sm/case/queryWgfaceByYear/2017?token=' + token + '', {})
      data = data.pointList;
      let intersectionMap = new IntersectionMap(mapObj);
      yield call(intersectionMap.addMapLay.bind(this, data, object.value));
      let filterBy = intersectionMap.filterBy;
      yield put({
        type: 'setIntersectionMapObj',
        payload: intersectionMap
      })
      yield put({
        type: 'setIntersectionMap',
        payload: filterBy
      })
      yield put({
        type: 'setTimeOpen'
      })
      yield put({
        type: 'setTimeState',
        payload: true
      })
    },
    *getSectionHotMap({ payload: object }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let mapObj = object.mapObj;
      let token = localStorage.getItem('token')
      let data = yield call(getHotMap, 'sm/case/queryWgfaceByYear/2017?token=' + token + '', {})
      data = data.roadList;
      let sectionHotMap = new SectionHotMap(mapObj);
      yield call(sectionHotMap.addMapLay.bind(this, data, object.value));
      let filterBy = sectionHotMap.filterBy;
      yield put({
        type: 'setIntersectionMapObj',
        payload: sectionHotMap
      })
      yield put({
        type: 'setIntersectionMap',
        payload: filterBy
      })
      yield put({
        type: 'setTimeOpen'
      })
      yield put({
        type: 'setTimeState',
        payload: true
      })
    },
    *getTSMap({ payload: object }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      yield put({
        type: 'cameraAnalysis/setLoading',
        payload: true
      })
      let mapObj = object.mapObj;
      let time = object.time;
      for (let i in time) {
        time[i] = time[i].replace(/[-]/g, "");
      }
      let data = yield call(getHotMap, `/sm/camera/queryCasesByDate/${time[0]}/${time[1]}?cameraNumLimit=-1`, {})
      data = data.data;
      let tabData = data.slice(0, 10);
      for (let i in tabData) {
        let str = '';
        let caseNum = 0;
        for (let j in tabData[i].caseTimeStep) {
          str += j + ','
          caseNum += tabData[i].caseTimeStep[j]
        }
        str = str.slice(0, str.length - 1);
        let name = '';
        for (let z in tabData[i].cameraTs) {
          name += tabData[i].cameraTs[z].name
        }
        tabData[i] = {
          ...tabData[i],
          ...{ name: name },
          ...{ key: tabData[i].smid, caseString: str,Num:caseNum}
        }
      }
      let tSMap = new TSMap(mapObj);
      yield call(tSMap.addMapLay.bind(this, data, object.value));
      yield put({
        type: 'setIntersectionMapObj',
        payload: tSMap
      })
      yield put({
        type: 'cameraAnalysis/setColumns',
        payload: tabData
      })
      yield put({
        type: 'cameraAnalysis/setTabShow',
        payload: true
      })
      yield put({
        type: 'cameraAnalysis/setLoading',
        payload: false
      })
    },
    *getTSHotMap({ payload: object }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      yield put({
        type: 'cameraAnalysis/setLoading',
        payload: true
      })
      let mapObj = object.mapObj;
      let time = object.time;
      for (let i in time) {
        time[i] = time[i].replace(/[-]/g, "");
      }
      let data = yield call(getHotMap, `/sm/camera/queryCasesByDate/${time[0]}/${time[1]}?cameraNumLimit=-1`, {})
      data = data.data;
      let tabData = data.slice(0, 10);
      for (let i in tabData) {
        let str = '';
        let caseNum = 0;
        for (let j in tabData[i].caseTimeStep) {
          str += j + ','
          caseNum += tabData[i].caseTimeStep[j]
        }
        str = str.slice(0, str.length - 1);
        let name = '';
        for (let z in tabData[i].cameraTs) {
          name += tabData[i].cameraTs[z].name
        }
        tabData[i] = {
          ...tabData[i],
          ...{ name: name },
          ...{ key: tabData[i].smid, caseString: str,Num:caseNum}
        }
      }
      let tSHotMap = new TSHotMap(mapObj);
      yield call(tSHotMap.addMapLay.bind(this, data, object.value));
      yield put({
        type: 'setIntersectionMapObj',
        payload: tSHotMap
      })
      yield put({
        type: 'cameraAnalysis/setColumns',
        payload: tabData
      })
      yield put({
        type: 'cameraAnalysis/setTabShow',
        payload: true
      })
      yield put({
        type: 'cameraAnalysis/setLoading',
        payload: false
      })
    },
    *getSectionMap({ payload: object }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let mapObj = object.mapObj;
      let token = localStorage.getItem('token')
      let data = yield call(getHotMap, 'sm/case/queryWgfaceByYear/2017?token=' + token + '', {})
      data = data.roadList;
      let sectionMap = new SectionMap(mapObj);
      yield call(sectionMap.addMapLay.bind(this, data, object.value));
      let filterBy = sectionMap.filterBy;
      yield put({
        type: 'setIntersectionMapObj',
        payload: sectionMap
      })
      yield put({
        type: 'setIntersectionMap',
        payload: filterBy
      })
      yield put({
        type: 'setTimeOpen'
      })
      yield put({
        type: 'setTimeState',
        payload: true
      })
    },
    *getIntersectionHotMap({ payload: object }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let mapObj = object.mapObj;
      let token = localStorage.getItem('token')
      let data = yield call(getHotMap, 'sm/case/queryWgfaceByYear/2017?token=' + token + '', {});
      data = data.pointList;
      let intersectionHotMap = new IntersectionHotMap(mapObj);
      yield call(intersectionHotMap.addMapLay.bind(this, data, object.value));
      let filterBy = intersectionHotMap.filterBy;
      yield put({
        type: 'setSectionMapObj',
        payload: intersectionHotMap
      })
      yield put({
        type: 'setSectionMap',
        payload: filterBy
      })
      yield put({
        type: 'setTimeOpen'
      })
      yield put({
        type: 'setTimeState',
        payload: true
      })
    },
    *getCameraMap({ payload: object }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let mapObj = object.mapObj;
      let token = localStorage.getItem('token')
      let data = yield call(getHotMap, 'sm/case/queryWgfaceByYear/2017?token=' + token + '', {});
      let hotMapData = yield call(getHotMap, 'sm/case/queryXyListByYear/2017/?token=' + token + '', {});
      hotMapData = hotMapData.data
      let cameraMap = new CameraMap(mapObj);
      yield call(cameraMap.addMapLay.bind(this, hotMapData, object.value));
      let filterBy = cameraMap.filterBy;
      yield put({
        type: 'setSectionMapObj',
        payload: cameraMap
      })
      yield put({
        type: 'setSectionMap',
        payload: filterBy
      })
      yield put({
        type: 'setTimeOpen'
      })
      yield put({
        type: 'setTimeState',
        payload: true
      })
    },
    *getCaseMap({ payload: object }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let map = yield select(state => state.map);
      let token = localStorage.getItem('token');
      let hotMapData = yield call(getHotMap, 'sm/case/queryXyListByYear/2017/?token=' + token + '', {});
      hotMapData = hotMapData.data
      let caseMap = new CaseMap(object.mapObj);
      yield call(caseMap.addMapLay.bind(this, hotMapData, object.value));
      let filterBy = caseMap.filterBy;
      yield put({
        type: 'setHotMapObj',
        payload: caseMap
      })
      yield put({
        type: 'setHotMap',
        payload: filterBy
      })
      yield put({
        type: 'setTimeOpen'
      })
      yield put({
        type: 'setTimeState',
        payload: true
      })
    },
    *getKernelMap({ payload: object }, { call, put, select }) {
      yield put({
        type: 'clearMapLayer'
      })
      let map = yield select(state => state.map);
      let caseMap = new KernelMap(object.mapObj, '');
      yield call(caseMap.addMapLay.bind(this));
    },
    *getAreaSpecia({ payload: object }, { call, put, select }) {
      let areaMap = new AreaMap(object.mapObj);
      yield call(areaMap.addMapLay);
    },
    //所有图层的删除方法
    *clearMapLayer({ payload }, { call, put, select }) {
      let map = yield select(state => state.map);
      if (map.pavementMapObj) {
        map.pavementMapObj.removeMapLay();
        yield put({
          type: 'setPavementMapObj',
          payload: ''
        })
        yield put({
          type: 'setPavementMap',
          payload: ''
        })
      }
      if (map.intersectionMapObj) {
        map.intersectionMapObj.removeMapLay();
        yield put({
          type: 'setIntersectionMapObj',
          payload: ''
        })
        yield put({
          type: 'setIntersectionMap',
          payload: ''
        })
      }
      if (map.sectionMapObj) {
        map.sectionMapObj.removeMapLay();
        yield put({
          type: 'setSectionMapObj',
          payload: ''
        })
        yield put({
          type: 'setSectionMap',
          payload: ''
        })
      }
      if (map.hotMapObj) {
        map.hotMapObj.removeMapLay();
        yield put({
          type: 'setHotMapObj',
          payload: ''
        })
      }
      if (map.custersMapObj) {
        map.custersMapObj.removeMapLay();
        yield put({
          type: 'setCustersMapObj',
          payload: ''
        })
      }
      if (map.gridMapObj) {
        map.gridMapObj.removeMapLay();
        yield put({
          type: 'setGridMapObj',
          payload: ''
        })
      }
      if (map.specialMapObj) {
        map.specialMapObj.removeMapLay();
        yield put({
          type: 'setSpecialMapObj',
          payload: ''
        })
      }
      yield put({
        type: 'setWitchData',
        payload: false
      })
      yield put({
        type: 'setTime',
        payload: 0
      })
      yield ({
        type: 'setMarks',
        payload: 0
      })
      yield put({
        type: 'setDeck',
        payload: false
      })
      yield put({
        type: 'cameraAnalysis/setTabShow',
        payload: false
      })
      if (map.timeOut) {
        yield put({
          type: 'shutTimeOpen'
        })
      }
      yield put({
        type: 'setTimeShowState',
        payload: false
      })
    },
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen((location) => {
    //     if (location.pathname === '/NuclearDensityAnalysis') {
    //       dispatch({ type: 'getSpecialMap' });
    //     }
    //     if (location.pathname === '/CameraManagement') {
    //       dispatch({ type: 'getHotMapTwo' });
    //     }
    //   })
    // },
  },
};