import {queryIserverData} from '../services/iserver'
import {shequDataDetail,gewangDataDetail} from '../services/user'
import {fangKong} from '../services/config'

//社区查询
export default {
  namespace: 'range',
  state: {
    pcs:[],
    cqsq:[],
    shequ:[],
    selectData:{
      oneOptions:[],
      twoOptions:[],
      threeOptions:[]
    },
    searchData:[],
    uiView:{
      sqFootModelView:false,
      sqRightModelView:false,
      cgFootModelView:false,
      cgRightModelView:false,
    },
    selGeometry:'',
    selSQqueryData:'',
    selGWqueryData:'',
    mapType:1,
    level:1,
    handlePcsChange:'',
    handleCqSqChange:'',
    handleSheQuChange:''
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
    *cqsq(payload, { call, put,select}) {
      const data  = yield call(queryIserverData,fangKong.datasets.level1.name);
      if(data!=null){
        const options = data.features;
        let selDataArray = yield select(state => state.range);
        let selData=selDataArray.selectData;
        selData['oneOptions']=options;
        // let treeData = selDataArray.treeData;
        // treeData = data.features;
        yield put({type:'updateStateData',payload:{
          cqsq:data.features,
          selectData:selData
        }});
      }
    },
    *pcs(payload, { call, put,select}) {
      const data  = yield call(queryIserverData,fangKong.datasets.level2.name);
      if(data!=null){
        let options=data.features.filter(item=>item.properties[fangKong.datasets.level2.filedKeyArea]=='城区');
        let selDataArray = yield select(state => state.range);
        let selData=selDataArray.selectData;
        selData['twoOptions']=options;
        yield put({type:'updateStateData',payload:{
          pcs:data.features,
          selectData:selData
        }});
      }
    },
    *shequ(payload, { call, put}) {
      const data  = yield call(queryIserverData,fangKong.datasets.level3.name);
      if(data!=null){
        let search=data.features.map(item=>item.properties[fangKong.datasets.level3.filedKeyName])
        //社区名称数据重复 去重
        let searchNew=[];
        for(let i=0;i<search.length;i++){
          if(searchNew.indexOf(search[i])==-1){
            searchNew.push(search[i]);
          }
        }
        yield put({type:'updateStateData',payload:{
          shequ:data.features,
          searchData:searchNew
         }
        });
      }
    },
    *sqDetail({ payload }, { call, put }) {
      const result  = yield call(shequDataDetail,payload.id);
      if(result!=null && result.code==0){
        yield put({type:'updateStateData',payload:{
          selSQqueryData:result.data
        }});
      }
    },
    *gwDetail({ payload }, { call, put }) {
      const result  = yield call(gewangDataDetail,payload.name);
      if(result!=null && result.code==0){
        yield put({type:'updateStateData',payload:{
          selGWqueryData:result.data
        }});
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen((location) => {
        // 初始进入页面时,根据业务进行相关方法的执行
        if (location.pathname === '/RangeQuery') {
          dispatch({ type: 'cqsq'})
          dispatch({type:'pcs'})
          dispatch({type:'shequ'})
        }
      })
    },
  },
};
