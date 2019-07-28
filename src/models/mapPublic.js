export default {
  namespace: 'mapPublic',
  state: {
    fullScreen: false,
    drawState: '',
    mapState:false,
    styleState:false,
    mapValue:[],
    styleValue:['黑夜'],
    mapPublicState:false
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
    setMapValue(state, { payload: mapValue }) {
      state.mapValue = mapValue;
      return { ...state };
    },
    setStyleValue(state, { payload: styleValue }) {
      state.styleValue = styleValue;
      return { ...state };
    },
    setMapPublicState(state, { payload: mapPublicState }) {
      state.mapPublicState = mapPublicState;
      return { ...state };
    },
  },
  effects: {

  },
  subscriptions: {

  },
};
