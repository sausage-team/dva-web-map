import {userRoleList} from '../services/user'
import { message} from 'antd';
export default {
    namespace: 'userrole',
    state: {
      data:[],
    },
    reducers: {
      querySuccess(state, { payload }) {
        return {
          ...state,
          data: payload,
        };
      },
    },effects: {
      *query({ payload:keywords}, { call,put,select})  {
        const token = localStorage.getItem('token');
        let params='page=1&limit=1000&token='+token+'&roleName='+keywords;
        const data = yield call(userRoleList,params);
      if (data.code == 0) {
        yield put({type:'querySuccess',payload:data.page.list});
       } else {
        message.error(data.msg);
       }
      }
    }
    ,subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
        history.listen((location) => {
          // 初始进入页面时,根据业务进行相关方法的执行
          if (location.pathname === '/RoleManagement') {
            dispatch({ type: 'query' , payload:''})
          }
        })
      },
    }
  };