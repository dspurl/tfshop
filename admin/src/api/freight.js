import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'freight',
    method: 'get',
    params: query
  })
}

export function create(data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'freight',
    method: 'post',
    data
  })
}

export function edit(data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'freight/' + data.id,
    method: 'post',
    data
  })
}

export function destroy(id, data) {
  data = Qs.parse({
    data
  })
  return request({
    url: 'freight/destroy/' + id,
    method: 'post',
    data
  })
}

export function detail(id) {
  return request({
    url: 'freight/' + id,
    method: 'get'
  })
}
