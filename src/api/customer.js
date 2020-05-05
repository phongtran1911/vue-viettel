import request from '@/utils/request'
import { urlApi } from './urlApi'
export function getList(token) {
    return request({
        url: urlApi.customer.getList + token,
        method: 'GET'
    })
}

export function postUpdateProfile(param,token) {
    return request({
        url: urlApi.customer.postUpdateProfile + token,
        method: 'POST',
        data: param
    })
}

export function postActiveUser(param,token) {
    return request({
        url: urlApi.customer.postActiveUser + token,
        method: 'POST',
        data: param
    })
}
