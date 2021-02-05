import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'specification',
    method: 'get',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'specification',
    method: 'post',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'specification/' + data.id,
    method: 'post',
    data
  })
}

export function destroy(id) {
  return request({
    url: 'specification/destroy/' + id,
    method: 'post'
  })
}
