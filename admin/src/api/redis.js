import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'redis',
    method: 'GET',
    params: query
  })
}

export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'redis/destroy/' + id,
    method: 'POST',
    data
  })
}
export function detail(id, data) {
  return request({
    url: 'redis/' + id,
    method: 'GET',
    params: data
  })
}
export function panel() {
  return request({
    url: 'redisPanel',
    method: 'GET'
  })
}
