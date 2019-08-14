import request from '../utils/request';
import {apiService} from './config'
export function userList(options) {
    let option = {
        method: 'GET'
    }
    return request(apiService + 'xk/sys/user/list?'+options, option);
}
export function userRoleList(options) {
    let option = {
        method: 'GET'
    }
    return request(apiService + 'xk/sys/role/list?'+options, option);
}
export function policeList(options) {
    let option = {
        method: 'GET'
    }
    return request(apiService + 'xk/police/queryNameList?'+options, option);
}
export function userUpdate(urlRight,options) {
    let option = {
        method: 'POST',
        headers: {
            'Content-Type':'application/json;charset=UTF-8'
        },
        body: JSON.stringify(options)
    }
    return request(apiService + urlRight, option);
}
export function userDelete(urlRight,options) {
    let option = {
        method: 'POST',
        headers: {
            'Content-Type':'application/json;charset=UTF-8'
        },
        body: JSON.stringify(options)
    }
    return request(apiService + urlRight, option);
}
export function valid(urlRight) {
    let option = {
        method: 'GET',

    }
    return request(apiService + urlRight, option);
}
export function login(urlRight, options) {
    let option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(options)
    }
    return request(apiService + urlRight, option);
}
export function getHotMap(urlRight) {
    let option = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
    }
    return request(apiService + urlRight, option);
}
export function mark(urlRight) {
    let option = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
    }
    return request(apiService + urlRight+'&token='+localStorage.getItem('token'), option);
}
export function CaseUpdate(urlRight, options) {
    let option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body:JSON.stringify(options)
    }
    return request(apiService + urlRight+'?token='+localStorage.getItem('token'), option);
}
//社区防控社区面详情数据
export function shequDataDetail(smid) {
    let option = {
        method: 'GET'
    }
    return request(apiService +'xk/police/queryCountyInfo/'+smid+'?token='+localStorage.getItem('token'), option);
}
//格网面详情数据
export function gewangDataDetail(name) {
    let option = {
        method: 'GET'
    }
    return request(apiService+'xk/police/queryCountryInfo/'+name+'?token='+localStorage.getItem('token'), option);
}
export function Update(urlRight, options) {
    console.log(options)
    let option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body:JSON.stringify(options)
    }
    return request(apiService + urlRight, option);
}
