import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'admin',
    method: 'GET',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'admin',
    method: 'POST',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'admin/' + data.id,
    method: 'POST',
    data
  })
}

export function destroy(id) {
  return request({
    url: 'admin/destroy/' + id,
    method: 'POST'
  })
}

export function log(query) {
  return request({
    url: 'admin/log',
    method: 'GET',
    params: query
  })
}

export function getAuthGroupList(query) {
  return request({
    url: 'authGroup',
    method: 'GET',
    params: query
  })
}
