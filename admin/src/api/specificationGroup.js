import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'specificationGroup',
    method: 'get',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'specificationGroup',
    method: 'post',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'specificationGroup/' + data.id,
    method: 'post',
    data
  })
}

export function destroy(id) {
  return request({
    url: 'specificationGroup/destroy/' + id,
    method: 'post'
  })
}
