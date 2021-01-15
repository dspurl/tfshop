import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'indent',
    method: 'get',
    params: query
  })
}

export function createSubmit(data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'indentShipments',
    method: 'POST',
    data
  })
}

export function updateSubmit(id, data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'indentRefund/' + id,
    method: 'PUT',
    data
  })
}

export function getDetails(id) {
  return request({
    url: 'indent/' + id,
    method: 'get'
  })
}

export function query(query) {
  return request({
    url: 'query',
    method: 'get',
    params: query
  })
}

export function updateDhl(data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'updateDhl',
    method: 'POST',
    data
  })
}
