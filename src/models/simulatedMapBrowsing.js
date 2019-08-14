import { getHotMap } from '../services/user';
export default {
  namespace: 'simulatedMapBrowsing',
  state: {
    radioValue:true,
    children:[],
    childrenData:'',
    flyManager:''
  },
  reducers: {
    setRadioValue(state,{ payload: radioValue }){
      state.radioValue = radioValue;
      return{...state,}
    },
    setChildren(state,{ payload: children }){
      state.children = children;
      return{...state,}
    },
    setChildrenData(state,{ payload: childrenData }){
      state.childrenData = childrenData;
      return{...state,}
    },
    setFlyManager(state,{ payload: flyManager }){
      state.flyManager = flyManager;
      return{...state,}
    },
  },
  effects: {//xk/3d/queryFlyRouteList
    *getFlyData(payload, { call, put }) {
      let flyData = yield call(getHotMap, 'xk/3d/queryFlyRouteList', {});
      console.log(flyData);
      let data=[];
      if(flyData.data[0]){
        for(let i in flyData.data){
          let text = flyData.data[i].split('.')
          let obj={
            'value':flyData.data[i],
            'text':text[0]
          }
          data.push(obj);
        }
        yield put({
          type:'setChildren',
          payload:data
        })
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/SimulatedMapBrowsing') {
          dispatch({ type:'getFlyData'});
        }
      })
    },
  },
};
