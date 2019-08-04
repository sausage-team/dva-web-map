import request from '../utils/request';
import {iserverBasePath} from './config'
//iserver 数据集查询
export function queryIserverData(dasetName) {
    let option = {
        method: 'GET'
    }
    return request(iserverBasePath + '/datasources/data/datasets/'+dasetName+'/features.geojson?fromIndex=0&toIndex=10000&maxFeatures=10000', option);
}
