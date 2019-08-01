//地图服务地址
export const iserverBasePath = 'http://graph.policegap.cn:8090/iserver/services/data-wuhan/rest/data';
// export const iserverBasePath = 'http://graph.policegap.cn:8090/iserver/services/data-mtghx_v2_20180227_dark/rest/data';
// export const iserverBasePath = 'http://10.12.69.181:8090/iserver/services/data-MTGDATA/rest/data';
//业务服务地址
export const apiService = 'http://graph.policegap.cn:8099/mtg-xlgc/';
// export const apiService = 'http://182.92.2.91:8081/mtg-xlgc/';
//export const apiService = 'http://192.168.12.213:8080/mtg-xlgc/';
// export const apiService = 'http://10.12.69.182:8080/mtg-xlgc/';
//警员头像
export const userAvABaseUrl = apiService+'photos/';
//飞行路径
export const FlyRoute = apiService+'flyroute/';
//三维数据
// export const ThreeServerApi = 'http://10.12.69.181:8090/iserver/services/';
// export const ThreeServerApi = 'http://localhost:8090/iserver/services/';map-ugcv5-MTGWGS84BZ/
export const ThreeServerApi = 'http://graph.policegap.cn:8090/iserver/services/';

//三维影像地形，数据，倾斜数据
export const ThreeServerApiData = [ThreeServerApi + '3D-HXYX/rest/realspace/datas/MTG_dem',
  ThreeServerApi + '3D-HXYX/rest/realspace/datas/MTGHXYX',
  ThreeServerApi + '3D-mtgimg/rest/realspace/datas/Config/config']

//海致BDP系统对接配置
export const bdpConfig= 'http://10.12.69.170/bdp-bridge.html';
export const fangKong = {
  layer: {
    pcs: {
      id: 'pcsArea',
      url: iserverBasePath + '/datasources/data/datasets/派出所辖区/features.geojson?fromIndex=0&toIndex=10000'
    },
    cqsq: {
      id: 'shanqunew',
      url: iserverBasePath + '/datasources/data/datasets/城区山区/features.geojson'
    },
    sq: {
      id: 'shequLayer',
      url: iserverBasePath + '/datasources/data/datasets/网格面/features.geojson?fromIndex=0&toIndex=10000'
    },
  },
  datasets: {
    level1: {
      name: '城区山区',
      filedKeyName: 'NAME'
    },
    level2: {
      name: '派出所辖区',
      filedKeyName: 'POLICE_NAME',
      filedKeyArea: '所属地区'
    },
    level3: {
      name: '网格面',
      filedKeyName: '辖区名称',
      filedKeyPolice: 'POLICE',
    }
  }
}
//三维拉升高度
export const ThreeDefaultHeight=200;
