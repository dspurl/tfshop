import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'admin',
    method: 'get',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'admin',
    method: 'post',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'admin/' + data.id,
    method: 'post',
    data
  })
}

export function destroy(id) {
  return request({
    url: 'admin/destroy/' + id,
    method: 'post'
  })
}
