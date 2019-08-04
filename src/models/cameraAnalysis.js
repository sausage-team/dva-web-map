export default {
  namespace: 'cameraAnalysis',
  state: {
    time:['2019-07-01','2019-07-31'],
    mapStart:' ',
    loading:true,
    columns:[],
    tabShow:false,
  },
  reducers: {
    setTime(state, { payload: time }){
      state.time=time;
      return{...state,}
    },
    setMapStart(state, { payload: mapStart }){
      state.mapStart=mapStart;
      return{...state,}
    },
    setLoading(state, { payload: loading }){
      state.loading=loading;
      return{...state,}
    },
    setColumns(state, { payload: columns }){
      state.columns=columns;
      return{...state,}
    },
    setTabShow(state, { payload: tabShow }){
      state.tabShow=tabShow;
      return{...state,}
    },
  },
  effects: {},
  subscriptions: {},
};
