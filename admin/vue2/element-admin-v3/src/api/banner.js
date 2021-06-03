import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'banner',
    method: 'GET',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'banner',
    method: 'POST',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'banner/' + data.id,
    method: 'POST',
    data
  })
}

export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'banner/destroy/' + id,
    method: 'POST',
    data
  })
}
