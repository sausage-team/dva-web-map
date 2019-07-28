import { valid, CaseUpdate } from '../services/user'
import { Upload, Icon, message, Button } from 'antd';
export default {
  namespace: 'statistics',
  state: {
    police: {},
    county: {},
    countyList: {},
    caseType: '',
    caseTypeMethod: '',
    caseTypeMethodList: '',
    placeType: '',
    placeTypeDetail: '',
    placeTypeDetailList: '',
    timeType: [
      { value: "0612", label: "上午 06:00 ~ 12:00" },
      { value: "1218", label: "下午 12:00 ~ 18:00" },
      { value: "1824", label: "前半夜 18:00 ~ 24:00" },
      { value: "0006", label: "后半夜 00:00 ~ 06:00" }
    ],
    checkCaseType: "",
    checkPlaceType: "",
    center: {
      ploiceArea: '',
      countyName: '',
      caseType: '',
      caseTypeMethod: '',
      placeType: '',
      placeTypeDetail: '',
      caseDateBegin: '',
      caseDateEnd: '',
      timeStep: '',
      mark: 'marked'
    },
    tabData: "",
    tabDataShow: false,
    visible: false,
    dataCenter: {},
    StatisticsShow: false,
    model: false,
    echartslayer: '',
  },
  reducers: {
    setEchartslayer(state, { payload: echartslayer }) {
      state.echartslayer = echartslayer;
      return { ...state };
    },
    setPolice(state, { payload: police }) {
      state.police = police;
      return { ...state };
    },
    setCounty(state, { payload: county }) {
      state.county = county;
      return { ...state };
    },
    setCountyList(state, { payload: countyList }) {
      state.countyList = countyList;
      return { ...state };
    },
    setCaseType(state, { payload: caseType }) {
      state.caseType = caseType;
      return { ...state };
    },
    setCaseTypeMethod(state, { payload: caseTypeMethod }) {
      state.caseTypeMethod = caseTypeMethod;
      return { ...state };
    },
    setCaseTypeMethodList(state, { payload: caseTypeMethodList }) {
      state.caseTypeMethodList = caseTypeMethodList;
      return { ...state };
    },
    setPlaceType(state, { payload: placeType }) {
      state.placeType = placeType;
      return { ...state };
    },
    setPlaceTypeDetail(state, { payload: placeTypeDetail }) {
      state.placeTypeDetail = placeTypeDetail;
      return { ...state };
    },
    setPlaceTypeDetailList(state, { payload: placeTypeDetailList }) {
      state.placeTypeDetailList = placeTypeDetailList;
      return { ...state };
    },
    setCheckCaseType(state, { payload: checkCaseType }) {
      state.checkCaseType = checkCaseType;
      return { ...state };
    },
    setCheckPlaceType(state, { payload: checkPlaceType }) {
      state.checkPlaceType = checkPlaceType;
      return { ...state };
    },
    setCenter(state, { payload: center }) {
      state.center = center;
      return { ...state };
    },
    setTabData(state, { payload: tabData }) {
      state.tabData = tabData;
      return { ...state };
    },
    setTabDataShow(state, { payload: tabDataShow }) {
      state.tabDataShow = tabDataShow;
      return { ...state };
    },
    setVisible(state, { payload: visible }) {
      state.visible = visible;
      return { ...state, };
    },
    setDataCenter(state, { payload: dataCenter }) {
      state.dataCenter = dataCenter;
      return { ...state, };
    },
    setStatisticsShow(state, { payload: StatisticsShow }) {
      state.StatisticsShow = StatisticsShow;
      return { ...state, };
    },
    setModel(state, { payload: model }) {
      state.model = model;
      return { ...state, };
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      let token = localStorage.getItem('token')
      const data = yield call(valid, 'sys/dict/listForType?token=' + token + '', {});
      let caseType = [];
      for (let i in data.data.caseType) {
        let obj = { label: data.data.caseType[i].name, value: data.data.caseType[i].id };
        caseType.push(obj)
      }
      yield put({
        type: 'setCaseType',
        payload: caseType
      })
      yield put({
        type: 'setCaseTypeMethod',
        payload: data.data.caseTypeMethod
      })
      let placeType = [];
      for (let i in data.data.placeType) {
        let obj = { label: data.data.placeType[i].name, value: data.data.placeType[i].id };
        placeType.push(obj)
      }
      yield put({
        type: 'setPlaceType',
        payload: placeType
      })
      yield put({
        type: 'setPlaceTypeDetail',
        payload: data.data.placeTypeDetail
      })
    },
    *police({ payload }, { call, put, select }) {
      let token = localStorage.getItem('token')
      const data = yield call(valid, 'sm/police/queryNameList?token=' + token + '', {});
      let policeList = []
      for (let i in data.data.policeList) {
        let obj = { label: data.data.policeList[i].policeName, value: data.data.policeList[i].policeName }
        policeList.push(obj)
      }
      yield put({
        type: 'setPolice',
        payload: policeList
      })
      yield put({
        type: 'setCounty',
        payload: data.data.countyList
      })
    },
    *getCase({ payload }, { call, put, select }) {
      let token = localStorage.getItem('token')
      let center = yield select(state => state.statistics);
      center = center.center;
      let url = '';
      for (let i in center) {
        if (center[i]) {
          url += '&' + i + '=' + center[i].toString()
        }
      }
      const data = yield call(valid, 'sm/case/queryCaseListByPage?pageNum=1&pageSize=100000&token=' + token + url + '', {});
      let markFor = data.data.list;
      let markTabData = [];
      for (let i in markFor) {
        let obj = {
          key: i,
          ...markFor[i]
        }
        markTabData.push(obj)
      }
      yield put({
        type: 'setTabData',
        payload: markTabData
      });
      yield put({
        type: 'setStatisticsShow',
        payload: false
      })
      yield put({
        type: 'setTabDataShow',
        payload: true
      })
      yield put({
        type: 'setCenter',
        payload: {
          ...center,
          ...{
            caseDateBegin: '',
            caseDateEnd: '',
            timeStep: '',
          }
        }
      })
      yield put({
        type: 'setModel',
        payload: true
      })
    },
    *caseUpData({ payload }, { call, put, select }) {
      const caseEntry = yield select(state => state.statistics);
      const dataCenter = caseEntry.dataCenter;
      const data = yield call(CaseUpdate, 'sm/case/update/' + dataCenter.smid + '', dataCenter);
      if (data.code == 0) {
        message.success(`上传成功，请及时编辑你的数据.`);
        yield put({
          type: 'getCase'
        })
      } else {
        message.error('上传失败' + data.msg)
      }
      yield put({
        type: 'setVisible',
        payload: false
      })
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen((location) => {
        // 初始进入页面时,根据业务进行相关方法的执行
        if (location.pathname === '/CaseInquiry') {
          dispatch({ type: 'query' });
          dispatch({ type: 'police' })
        }
      })
    },
  },
};
