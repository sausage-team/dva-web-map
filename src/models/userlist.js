import {userList,userUpdate,policeList,userDelete,userRoleList} from '../services/user'
import { message, Button } from 'antd';
import { routerRedux } from 'dva/router'
export default {
    namespace: 'userlist',
    state:{
      data:[],
      pagesize:10,
      loading: false,
      selRowKeys:[],
      curItem: {},
      modalVisible: false,
      modalUpdateVisible: false,
      policeData:[],
      roleData:[],
    },
    reducers: {
      updateStateData(state, { payload}) {
         return {...state,...payload};
      },
      setSelectedRowKeys(state, { payload:rowKeys}){
        return {
          ...state,selRowKeys: rowKeys
         };
        },
      querySuccess(state, { payload }) {
        return {
          ...state,
          data: payload,
        };
      },
      queryPoliceSuccess(state, {payload}) {
        return {
          ...state,
          policeData: payload,
        };
      },queryRoleSuccess(state, {payload}) {
        return {
          ...state,
          roleData: payload,
        };
      },
    },
    effects: {
      *query({ payload:keywords}, { call,put,select})  {
        const token = localStorage.getItem('token');
        //如果为派出所管理员 只允许查询当前派出所警员
        const user=localStorage.getItem('user');
        let {pcsname,roleList}=JSON.parse(user);
        let pcsDefault='';
        if(roleList.length>0){
          let userRole=roleList[0];
          if(userRole.roleCode=='pcs_admin'){//派出所管理员
            pcsDefault=pcsname;
          }
        }
        let params='page=1&limit=1000&token='+token+'&username='+keywords+"&pcsname="+pcsDefault;
        const data = yield call(userList,params);
      if (data.code == 0) {
        yield put({type:'querySuccess',payload:data.page.list});
      } else {
        message.error(data.msg);
       }
      },
      *queryPolice({payload},{ call,put,select})  {
        const token = localStorage.getItem('token');
        let params='token='+token;
        const result = yield call(policeList,params);
        if (result.code == 0) {
          yield put({type:'queryPoliceSuccess',payload:result.data.policeList});
        }
      },*queryRole({ payload}, { call,put,select})  {
        const token = localStorage.getItem('token');
        let params='page=1&limit=1000&token='+token;
        const data = yield call(userRoleList,params);
      if (data.code == 0) {
          yield put({type:'queryRoleSuccess',payload:data.page.list});
        }
      },
      *userAddUpdate({payload}, {call, put}) {  // eslint-disable-line
        const token = localStorage.getItem('token');
        let params='token='+token;
        let requrl='xk/sys/user/save?'+params;
        if (payload.type === 'edit') {
          requrl='xk/sys/user/update?'+params;
        }
        const data= yield call(userUpdate,requrl,payload.user);
        if(data.code==0){
          message.success(data.msg);
          const updateStateData={};
          if (payload.type === 'edit') {
            updateStateData['modalUpdateVisible']=false;
          }else{
            updateStateData['modalVisible']=false;
          }
          yield put({type: 'updateStateData', payload: updateStateData});
          yield put(routerRedux.push('/UserManagement'));
        }else{
          message.error(data.msg);
        }
      },
      *deluser({payload}, {call,select,put}) {  // eslint-disable-line
         let option=yield select(state=>state.userlist);
         option=option.selRowKeys;
         let requrl='xk/sys/user/delete?token='+localStorage.getItem('token');
         const result = yield call(userDelete,requrl, option);
        if (result.code ===0) {
          message.success(result.msg);
          yield put(routerRedux.push('/UserManagement'));
        }else{
          message.error(result.msg);
        }
      },
    },
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
        history.listen((location) => {
          // 初始进入页面时,根据业务进行相关方法的执行
          if (location.pathname === '/UserManagement') {
            dispatch({ type: 'query' , payload:''})
            dispatch({type:'queryPolice'})
            dispatch({type:'queryRole'})
          }
        })
      },
    }
  };
