import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'freight',
    method: 'GET',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'freight',
    method: 'POST',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'freight/' + data.id,
    method: 'POST',
    data
  })
}

export function destroy(id) {
  return request({
    url: 'freight/destroy/' + id,
    method: 'POST'
  })
}

export function detail(id) {
  return request({
    url: 'freight/' + id,
    method: 'GET'
  })
}
