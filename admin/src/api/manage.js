import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'manage',
    method: 'get',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'manage',
    method: 'post',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'manage/' + data.id,
    method: 'post',
    data
  })
}

export function destroy(id) {
  return request({
    url: 'manage/destroy/' + id,
    method: 'post'
  })
}
