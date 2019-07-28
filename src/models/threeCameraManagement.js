import { getHotMap } from '../services/user';
import img from '../../public/img/defalutImg.png'
export default {
  namespace: 'threeCameraManagement',
  state: {
    expandedKeys: [],
    searchValue:'',
    autoExpandParent: true,
    dataList:[],
    gData:[{
      title: 0,
      key: '城子派出所',
      children: []
    }, {
      title: 1,
      key: '月季园派出所',
      children: []
    }, {
      title: 2,
      key: '永定派出所',
      children: []
    }, {
      title: 3,
      key: '三家店派出所',
      children: []
    }, {
      title: 4,
      key: '东辛房派出所',
      children: []
    }, {
      title:5,
      key: '大峪派出所',
      children: []
    }, {
      title:6,
      key:'潭柘寺派出所',
      children: []
    }, {
      title:7,
      key: '军庄派出所',
      children: []
    }, {
      title:8,
      key:'妙峰山派出所',
      children: []
    }, {
      title:9,
      key:'色树坟派出所',
      children: []
    }, {
      title: 10,
      key: '雁翅派出所',
      children: []
    }, {
      title: 11,
      key:'大台派出所',
      children: []
    }, {
      title: 12,
      key: '斋堂派出所',
      children: []
    }, {
      title: 13,
      key:'清水派出所',
      children: []
    }, {
      title: 14,
      key: '-',
      children: []
    }],
    checkedKeys:[],
    checkable:false,
    timeObj:'',
    loading:true,
    columns:[],
  },
  reducers: {
    setExpandedKeys(state, { payload: expandedKeys }) {
      state.expandedKeys = expandedKeys;
      return { ...state };
    },
    setSearchValue(state, { payload: searchValue }) {
      state.searchValue = searchValue;
      return { ...state };
    },
    setAutoExpandParent(state, { payload: autoExpandParent }) {
      state.autoExpandParent = autoExpandParent;
      return { ...state };
    },
    setGData(state, { payload: gData }) {
      state.gData = gData;
      return { ...state };
    },
    setDataList(state, { payload: dataList }) {
      state.dataList = dataList;
      return { ...state };
    },
    setCheckedKeys(state, { payload: checkedKeys }) {
      state.checkedKeys = checkedKeys;
      return { ...state };
    },
    setCheckable(state, { payload: checkable }) {
      state.checkable = checkable;
      return { ...state };
    },
    setTimeObj(state, { payload: timeObj }) {
      state.timeObj = timeObj;
      return { ...state };
    },
    setLoading(state, { payload: loading }) {
      state.loading = loading;
      return { ...state };
    },
    setColumns(state, { payload: columns }) {
      state.columns = columns;
      return { ...state };
    },
  },
  effects: {
    *getPoliceList({ payload:num }, { call, put, select }) {
      let treeData = [{
        title: 0,
        key: '城子派出所',
        children: []
      }, {
        title: 1,
        key: '月季园派出所',
        children: []
      }, {
        title: 2,
        key: '永定派出所',
        children: []
      }, {
        title: 3,
        key: '三家店派出所',
        children: []
      }, {
        title: 4,
        key: '东辛房派出所',
        children: []
      }, {
        title:5,
        key: '大峪派出所',
        children: []
      }, {
        title:6,
        key:'潭柘寺派出所',
        children: []
      }, {
        title:7,
        key: '军庄派出所',
        children: []
      }, {
        title:8,
        key:'妙峰山派出所',
        children: []
      }, {
        title:9,
        key:'色树坟派出所',
        children: []
      }, {
        title: 10,
        key: '雁翅派出所',
        children: []
      }, {
        title: 11,
        key:'大台派出所',
        children: []
      }, {
        title: 12,
        key: '斋堂派出所',
        children: []
      }, {
        title: 13,
        key:'清水派出所',
        children: []
      }, {
        title: 14,
        key: '-',
        children: []
      }]
      let PoliceListData = yield call(getHotMap, 'sm/3d/queryPoliceList/'+num+'', {});
      let dataList = [];
      if (PoliceListData.code == 0) {
        let data = PoliceListData.data;
        for (let j in treeData) {
          if (data[treeData[j].key]) {
            for (let i in data[treeData[j].key]) {
              let obj = {
                title: data[treeData[j].key][i].username,
                key: '警员' + data[treeData[j].key][i].username,
                ...data[treeData[j].key][i]
              }
              dataList.push(obj);
              treeData[j].children.push(obj);
            }
          }
        }
        yield put({
          type:'setDataList',
          payload:dataList
        })
        yield put({
          type:'setGData',
          payload:treeData
        })
      }
    },
    *getPoliceLocation({ payload:arr }, { call, put, select }) {
      let outArr = [];
      for(let i in arr){
        let locData= arr[i].split('警员');
        outArr.push(locData[1])
      }
      let PoliceListData = yield call(getHotMap, 'sm/3d/queryPoliceLocation/'+outArr.toString()+'', {});
      if(PoliceListData.code == 0){
        let data = PoliceListData.data;
        let obj = {
         //name:data[0].username,
          // y:parseFloat(data[0].latitude),
          // x:parseFloat(data[0].longitude),
          name:'admin',
          y:parseFloat(39.9443),
          x:parseFloat(116.07564),
        }
        console.log(obj)
        yield put({
          type:'getEntities',
          payload:obj
        })
      }
    },
    *getEntities({ payload:obj }, { call, put, select }) {
      let cesium = yield select(state => state.cesium);
      let cesiumObj = cesium.cesiumObj;
      cesiumObj.entities.removeAll();
     let demo= cesiumObj.entities.add({
        position : Cesium.Cartesian3.fromDegrees(obj.x, obj.y,20),
        billboard : {
          image : img,
          width : 40,
          height : 40
        },
        label : {
          text : obj.name,
          font : '14pt monospace',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth : 1,
          verticalOrigin : Cesium.VerticalOrigin.TOP,
          pixelOffset : new Cesium.Cartesian2(0, -43)
        }
      });
      //cesiumObj.entities.removeAll();
    },
    // *getEntities({ payload:arr }, { call, put, select }) {
    //   let outArr = [];
    //   for(let i in arr){
    //     let locData= arr[i].split('警员');
    //     outArr.push(locData[1])
    //   }
    //   let PoliceListData = yield call(getHotMap, 'sm/3d/queryPoliceLocation/'+outArr.toString()+'', {});
    //   console.log(PoliceListData)
    //   if(PoliceListData.code == 0){
    //     let data = PoliceListData.data;
    //     let obj = {
    //      //name:data[0].username,
    //       // y:parseFloat(data[0].latitude),
    //       // x:parseFloat(data[0].longitude),
    //       name:'admin',
    //       y:parseFloat(39.9443),
    //       x:parseFloat(116.07564),
    //     }
    //     console.log(obj)
    //     yield put({
    //       type:'getEntities',
    //       payload:obj
    //     })
    //   }
    // },
    *setTabData({ payload:arr }, { call, put, select }) {
      yield put({
        type:'setLoading',
        payload:true,
      })
      let threeCameraManagement = yield select(state => state.threeCameraManagement);
      let dataList = threeCameraManagement.dataList;
      let columns = [];
      for(let i in arr){
        let locData= arr[i].split('警员');
        locData = locData[1];
        for(let j in dataList){
          if(locData == dataList[j].username){
            columns.push(dataList[j]);
            break;
          }
        }
      }
      console.log(columns)
      yield put({
        type:'setColumns',
        payload:columns
      });
      yield put({
        type:'setLoading',
        payload:false,
      })
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/ThreeCameraManagement') {
          dispatch({ type: 'getPoliceList',payload:0});
        }
      })
    },
  },
};
