import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'banner',
    method: 'get',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'banner',
    method: 'post',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'banner/' + data.id,
    method: 'post',
    data
  })
}

export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'banner/destroy/' + id,
    method: 'post',
    data
  })
}
