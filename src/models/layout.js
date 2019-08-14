import {valid} from '../services/user';
import { routerRedux } from 'dva/router'
export default {
  namespace: 'layout',
  state: {
  },
  reducers: {
  },
  effects: {
    *query({ payload }, { call, put, select }) {  // eslint-disable-line
      const token = localStorage.getItem('token')
      const data = yield call(valid,'token/valid?token='+token +'', '')
      if (data.code !== 0) {
        yield put(routerRedux.push('/login'))
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
     //dispatch({ type: 'query' })
    },
  },
}
