
export default {
  namespace: 'cameraManagement',
  state: {
    mapDataState: false
  },
  reducers: {
    setMapDataState(state, { payload: mapDataState }) {
      state.mapDataState = mapDataState;
      return { ...state };
    }
  },
  effects: {},
  subscriptions: {},
};
