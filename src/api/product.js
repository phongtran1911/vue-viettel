import request from '@/utils/request'
import { urlApi } from './urlApi'

export function getListProduct(groupID,token) {
    return request({
        url: urlApi.product.getListbyGroupID + groupID + '?token=' + token,
        method: 'GET'
    })
}

export function getListProductGroup(catID,token) {
    return request({
        url: urlApi.productgroup.getListbyCatID + catID + '?token=' + token,
        method: 'GET'
    })
}

export function getListCategory(token) {
    return request({
        url: urlApi.category.getList + token,
        method: 'GET'
    })
}

export function postCreateProduct(param,token) {
    return request({
        url: urlApi.product.postCreatProduct + token,
        method: 'POST',
        data: param
    })
}

export function putCreateProduct(param,token) {
    return request({
        url: urlApi.product.putUpdateProduct + token,
        method: 'PUT',
        data: param
    })
}

export function getProductbyID(id, token) {
    return request({
        url: urlApi.product.getProductbyID + id + '?token=' + token,
        method: 'GET'
    })
}