import {queryIserverData} from '../services/iserver'
import {fangKong} from '../services/config'
//派出所辖区查询
export default {
  namespace: 'policeArea',
  state: {
    pcs:[],
    cqsq:[],
    selectData:{
      oneOptions:[],
      twoOptions:[],
    },
    uiView:{
      sqFootModelView:false,
    },
    selGeometry:'',
    searchData:[],
    mapType:1,
    handlePcsChange:'',
    handleCqSqChange:'',
  },
  reducers: {
    updateStateData(state,{payload}){
      return {...state,...payload}
    },
    updateStateUi(state,{payload}){
      return {...state,uiView:payload}
    }
  },
  effects: {
    *cqsq({ payload }, { call, put,select}) { 
      const data  = yield call(queryIserverData,fangKong.datasets.level1.name);
      if(data!=null){
        const options = data.features;
        let selDataArray = yield select(state => state.range);
        let selData=selDataArray.selectData;
        selData['oneOptions']=options;
        let treeData=selDataArray.treeData;
        treeData=data.features;
        yield put({type:'updateStateData',payload:{
          cqsq:data.features,
          selectData:selData
        }});
      }
    },
    *pcs({ payload }, { call, put,select}) { 
      const data  = yield call(queryIserverData,fangKong.datasets.level2.name);
      if(data!=null){
        let options=data.features.filter(item=>item.properties[fangKong.datasets.level2.filedKeyArea]=='城区');
        let selDataArray = yield select(state => state.range);
        let search=data.features.map(item=>item.properties[fangKong.datasets.level2.filedKeyName])
        let selData=selDataArray.selectData;
        selData['twoOptions']=options;
        yield put({type:'updateStateData',payload:{
          pcs:data.features,
          selectData:selData,
          searchData:search
        }});
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen((location) => {
        // 初始进入页面时,根据业务进行相关方法的执行
        if (location.pathname === '/PoliceAreaQuery') {
          dispatch({ type: 'cqsq'})
          dispatch({type:'pcs'})
        }
      })
    },
  },
};
