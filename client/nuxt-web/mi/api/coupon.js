import request from '@/plugins/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'coupon',
    method: 'GET',
    params: query
  })
}
export function getUserList(query) {
  return request({
    url: 'coupon/user',
    method: 'GET',
    params: query
  })
}
export function count() {
  return request({
    url: 'coupon/user/count',
    method: 'GET'
  })
}
export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'coupon',
    method: 'POST',
    data
  })
}
