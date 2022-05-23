import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'seckill',
    method: 'GET',
    params: query
  })
}
export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'seckill',
    method: 'POST',
    data
  })
}
export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'seckill/' + data.id,
    method: 'POST',
    data
  })
}
export function detail(id) {
  return request({
    url: 'seckill/' + id,
    method: 'GET'
  })
}
export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'seckill/destroy/' + id,
    method: 'POST',
    data
  })
}
