export default {
  namespace: 'cesiumPublic',
  state: {
    fullScreen: false,
    drawState: '',
    mapState:false,
    styleState:false,
    mapPublicState:false,
    changeModel:0
  },
  reducers: {
    setFullScreen(state, { payload: fullScreen }) {
      state.fullScreen = fullScreen;
      return { ...state };
    },
    setDrawState(state, { payload: drawState }) {
      state.drawState = drawState;
      return { ...state };
    },
    setMapState(state, { payload: mapState }) {
      state.mapState = mapState;
      return { ...state };
    },
    setStyleState(state, { payload: styleState }) {
      state.styleState = styleState;
      return { ...state };
    },
    setMapPublicState(state, { payload: mapPublicState }) {
      state.mapPublicState = mapPublicState;
      return { ...state };
    },
    setChangeModel(state, { payload: changeModel }) {
      state.changeModel = changeModel;
      return { ...state };
    },
  },
  effects: {

  },
  subscriptions: {

  },
};
