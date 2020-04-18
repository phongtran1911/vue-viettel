import request from '@/utils/request'
import { urlApi } from './urlApi'

export function getListCategory(token) {
    return request({
        url: urlApi.category.getList + token,
        method: 'GET'
    })
}

export function getListProductGroup(catID,token) {
    return request({
        url: urlApi.productgroup.getListbyCatID + catID + '?token=' + token,
        method: 'GET'
    })
}

export function postCreateGroup(param,token) {
    return request({
        url: urlApi.productgroup.postCreateGroup + token,
        method: 'POST',
        data: param
    })
}

export function putCreateGroup(param,token) {
    return request({
        url: urlApi.productgroup.putUpdateGroup + token,
        method: 'PUT',
        data: param
    })
}

export function getProductGroupbyID(id, token) {
    return request({
        url: urlApi.productgroup.getProductGroupbyID + id + '?token=' + token,
        method: 'GET'
    })
}