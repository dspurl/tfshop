import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'redis',
    method: 'get',
    params: query
  })
}

export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'redis/destroy/' + id,
    method: 'post',
    data
  })
}
export function detail(id, data) {
  return request({
    url: 'redis/' + id,
    method: 'get',
    params: data
  })
}
export function panel() {
  return request({
    url: 'redisPanel',
    method: 'get'
  })
}
