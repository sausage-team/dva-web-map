
export default {
  namespace: 'caseManagment',
  state: {
    sliderShow:false,
    sliderValue:'',
  },
  reducers: {
    setSliderShow(state, { payload: sliderShow }){
      state.sliderShow = sliderShow;
      return {...state};
    },
    setSliderValue(state, { payload: sliderValue }){
      state.sliderValue = sliderValue;
      return {...state};
    }
  },
  effects: {},
  subscriptions: {},
};
