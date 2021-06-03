import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'brand',
    method: 'GET',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'brand',
    method: 'POST',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'brand/' + data.id,
    method: 'POST',
    data
  })
}

export function destroy(id) {
  return request({
    url: 'brand/destroy/' + id,
    method: 'POST'
  })
}
