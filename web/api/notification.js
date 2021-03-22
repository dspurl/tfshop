import request from '@/plugins/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'notification',
    method: 'GET',
    params: query
  })
}
export function detail(id) {
  return request({
    url: 'notification/detail/' + id,
    method: 'GET'
  })
}
export function unread(query) {
  return request({
    url: 'notification/unread',
    method: 'GET',
    params: query
  })
}
export function read(data) {
  data = Qs.parse(data)
  return request({
    url: 'notification/read/0',
    method: 'POST',
    data
  })
}
export function destroy(data) {
  data = Qs.parse(data)
  return request({
    url: 'notification/destroy/0',
    method: 'POST',
    data
  })
}
