import request from '@/utils/request'
import { urlApi } from './urlApi'
export function getList(token) {
    return request({
        url: urlApi.po.getListPO + token,
        method: 'GET'
    })
}