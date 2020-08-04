import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'redis',
    method: 'get',
    params: query
  })
}

export function panel() {
  return request({
    url: 'redisPanel',
    method: 'get'
  })
}

export function show(name, data) {
  return request({
    url: 'redis/' + name,
    method: 'GET',
    params: data
  })
}

export function setDelete(id, data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'redis/' + id,
    method: 'DELETE',
    data
  })
}

