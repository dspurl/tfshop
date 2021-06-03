import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'manage',
    method: 'GET',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'manage',
    method: 'POST',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'manage/' + data.id,
    method: 'POST',
    data
  })
}

export function destroy(id) {
  return request({
    url: 'manage/destroy/' + id,
    method: 'POST'
  })
}
