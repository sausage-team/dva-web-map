import {login} from '../services/user'
import { message, Button } from 'antd';
import { routerRedux } from 'dva/router'
export default {
  namespace: 'users',
  state: {
    login:{
      username:'',
      password:''
    }
  },
  reducers: {
    setLogin(state, {payload:login}) {
      state.login = login;
      return { ...state};
    },
  },
  effects: {
    *login({ payload }, { call, put,select}) { 
      let option = yield select(state => state.users);
      option =option.login;
      const data  = yield call(login,'sys/login',option);
      if(data.code==0){
        localStorage.setItem('token',data.token);
        localStorage.setItem('user',JSON.stringify(data.user));
        yield put(routerRedux.push('/'));
      }else{
        message.error(data.msg);
      }
    },
  },
  subscriptions: {},
};
