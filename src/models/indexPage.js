import {userList} from '../services/user';
export default {

  namespace: 'indexPage',

  state: {
    stateUp:'true'
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put,select}) {  // eslint-disable-line
      
    },
  },

  reducers: {
    setStateUp(state, {payload:stateUp}) {
      state.stateUp = stateUp
      return { ...state,};
    },
  },

};
