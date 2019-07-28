
export default {
  namespace: 'cesium',
  state: {
    cesiumObj: ''
  },
  reducers: {
    setCesiumObj(state, { payload: cesiumObj }) {
      state.cesiumObj = cesiumObj;
      return { ...state }
    }
  },
  effects: {

  },
  subscriptions: {

  },
};
