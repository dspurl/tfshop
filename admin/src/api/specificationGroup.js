import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'specificationGroup',
    method: 'GET',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'specificationGroup',
    method: 'POST',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'specificationGroup/' + data.id,
    method: 'POST',
    data
  })
}

export function destroy(id) {
  return request({
    url: 'specificationGroup/destroy/' + id,
    method: 'POST'
  })
}
