import {getHotMap,Update} from '../services/user';
import { message, Button } from 'antd';
import moment from 'moment';
export default {
  namespace: 'pavementAnalysis',
  state: {
    pavementAnalysisData:'',
    columns:'',
    loading:true,
    visible:false,
    modelData:'',
    mapLayer:'',
    tabShow:false,
    sliderShow:false,
    disabled:true,
    buttonValue:'编辑',
    upData:{
      type:'',
      smid:'',
      formula: "",
      caseNumJson: ""
    }
  },
  reducers: {
    setPavementAnalysisData(state, { payload: pavementAnalysisData }) {
      state.pavementAnalysisData = pavementAnalysisData;
      return { ...state, };
    },
    setColumns(state, { payload: columns }) {
      state.columns = columns;
      return { ...state, };
    },
    setLoading(state, { payload: loading }) {
      state.loading = loading;
      return { ...state, };
    },
    setModelData(state, { payload: modelData }) {
      state.modelData = modelData;
      return { ...state, };
    },
    setVisible(state, { payload: visible }) {
      state.visible = visible;
      return { ...state, };
    },
    setMapLayer(state, { payload: mapLayer }) {
      state.mapLayer = mapLayer;
      return { ...state, };
    },
    setTabShow(state, { payload: tabShow }) {
      state.tabShow = tabShow;
      return { ...state, };
    },
    setSliderShow(state, { payload: sliderShow }) {
      state.sliderShow = sliderShow;
      return { ...state, };
    },
    setDisabled(state, { payload: disabled }) {
      state.disabled = disabled;
      return { ...state, };
    },
    setButtonValue(state, { payload: buttonValue }) {
      state.buttonValue = buttonValue;
      return { ...state, };
    },
    setUpData(state, { payload: upData }) {
      state.upData = upData;
      return { ...state, };
    },
  },
  effects: {
    *getPavementData({payload}, { call, put, select }){
      let token = localStorage.getItem('token');
      yield put({
        type: 'setLoading',
        payload: true
      })
      yield put({
        type: 'map/setMapLoading',
        payload: true
      })
      let data = yield call(getHotMap,'xk/case/queryWgfaceByYear/'+moment().year()+'?token='+token+'',{})
      yield put({
        type: 'setLoading',
        payload: false
      })
      yield put({
        type: 'map/setMapLoading',
        payload: false
      })
      yield put({
        type:'setPavementAnalysisData',
        payload:data
      })
    },
    *setUp({payload}, { call, put, select }){
      let state = yield select(state => state.pavementAnalysis);
      let upData = state.upData;
      upData = JSON.stringify(upData);
      let data = yield call(Update,'xk/case/updateFormulaBySmid/'+state.upData.type+'/'+state.upData.smid+'',upData);
      if(data.code==0){
        let columns = state.columns;
        for(let i in columns){//modelData
          if(columns[i].smid = data.smid){
            columns[i].num =data.caseNum;
            break;
          }
        }
        let modelData = state.modelData;
        modelData.num = data.caseNum;
        yield put({
          type:'setColumns',
          payload:columns
        })
        yield put({
          type:'setModelData',
          payload:modelData
        })
      }else{
        message.error(data.msg);
      }
    }
  },
  subscriptions: {},
};
