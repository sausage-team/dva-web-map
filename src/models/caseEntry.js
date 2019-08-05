import { mark, CaseUpdate } from '../services/user'
import { Upload, Icon, message, Button } from 'antd';
export default {
  namespace: 'caseEntry',
  state: {
    updatastate: {
      name: 'file',
      action: 'http://182.92.2.91:8081/mtg-xlgc/xk/case/excel?token=' + localStorage.getItem('token') + ''
    },
    updata: '',
    okList: '',
    errorList: '',
    model: false,
    nomark: '',
    mark: '',
    tabName: ["已标注", "未标注"],
    pagination1: {},
    pagination2: {},
    loading: false,
    dataCenter: {},
    visible: false,
    echartslayer:'',
  },
  reducers: {
    setEchartslayer(state, { payload: echartslayer }) {
      state.echartslayer = echartslayer;
      return { ...state, };
    },
    setUpdata(state, { payload: updata }) {
      state.updata = updata;
      return { ...state, };
    },
    setOkList(state, { payload: okList }) {
      state.okList = okList;
      return { ...state, };
    },
    setErrorList(state, { payload: errorList }) {
      state.errorList = errorList;
      return { ...state, };
    },
    setModel(state, { payload: model }) {
      state.model = model;
      return { ...state, };
    },
    setNomark(state, { payload: nomark }) {
      state.nomark = nomark;
      return { ...state, };
    },
    setMark(state, { payload: mark }) {
      state.mark = mark;
      return { ...state, };
    },
    setTabName(state, { payload: tabName }) {
      state.tabName = tabName;
      return { ...state, };
    },
    setPagination1(state, { payload: pagination1 }) {
      state.pagination1 = pagination1;
      return { ...state, };
    },
    setPagination2(state, { payload: pagination2 }) {
      state.pagination2 = pagination2;
      return { ...state, };
    },
    setLoading(state, { payload: loading }) {
      state.loading = loading;
      return { ...state, };
    },
    setDataCenter(state, { payload: dataCenter }) {
      state.dataCenter = dataCenter;
      return { ...state, };
    },
    setVisible(state, { payload: visible }) {
      state.visible = visible;
      return { ...state, };
    },
  },
  effects: {
    *nomark({ payload: page }, { call, put, select }) {  // eslint-disable-line

      if (!page) {
        page = 1
      }
      yield put({
        type: 'setLoading',
        payload: true
      })
      let markData = yield call(mark, 'xk/case/queryCaseListByPage?pageNum=' + page + '&pageSize=5&mark=marked', {})
      yield put({
        type: 'setLoading',
        payload: false
      })
      let markFor = markData.data.list;
      let markTabData = [];
      for (let i in markFor) {
        let obj = {
          key: i,
          ...markFor[i]
        }
        markTabData.push(obj)
      }
      yield put({
        type: 'setMark',
        payload: markTabData
      })
      let pagination = {
        total: markData.data.total,
        hideOnSinglePage: true,
        pageSize: 5
      }
      yield put({
        type: 'setPagination1',
        payload: pagination
      })
    },
    *marked({ payload: page }, { call, put, select }) {  // eslint-disable-line
      if (!page) {
        page = 1
      }
      yield put({
        type: 'setLoading',
        payload: true
      })
      let markData = yield call(mark, 'xk/case/queryCaseListByPage?pageNum=' + page + '&pageSize=5&mark=nomark', {});
      yield put({
        type: 'setLoading',
        payload: false
      })
      let markFor = markData.data.list;
      let nomarkTabData = [];
      for (let i in markFor) {
        let obj = {
          key: i,
          ...markFor[i]
        }
        nomarkTabData.push(obj)
      }
      yield put({
        type: 'setNomark',
        payload: nomarkTabData
      })
      let pagination = {
        total: markData.data.total,
        hideOnSinglePage: true,
        pageSize: 5
      }
      yield put({
        type: 'setPagination2',
        payload: pagination
      })

    },
    *caseUpData({ payload }, { call, put, select }) {
      const caseEntry = yield select(state => state.caseEntry);
      const dataCenter = caseEntry.dataCenter;
      const data = yield call(CaseUpdate, 'xk/case/update/' + dataCenter.smid + '', dataCenter);
      if (data.code == 0) {
        message.success(`上传成功，请及时编辑你的数据.`);
        yield put({
          type: 'marked'
        })
        yield put({
          type: 'nomark'
        })
      } else {
        message.error('上传失败' + data.msg)
      }
      yield put({
        type: 'setVisible',
        payload: false
      })
    },
    *updataXY({ payload }, { call, put, select }) {
      const caseEntry = yield select(state => state.caseEntry);
      const updataXY = caseEntry.updataXY;
      const data = yield call(CaseUpdate, 'xk/case/updateXy/' + caseEntry.smid + '', updataXY);
      if (data.code == 0) {
        message.success(`上传成功，请及时编辑你的数据.`);
        yield put({
          type: 'marked'
        })
      } else {
        message.error('上传失败' + data.msg)
      }
    }
  },
  subscriptions: {

    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen((location) => {
        // 初始进入页面时,根据业务进行相关方法的执行
        if (location.pathname === '/CaseEntry') {
          dispatch({ type: 'nomark' });
          dispatch({ type: 'marked' })
        }
      })
    },
  },
};
