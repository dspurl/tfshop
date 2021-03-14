import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'power',
    method: 'GET',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'power',
    method: 'POST',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'power/' + data.id,
    method: 'POST',
    data
  })
}

export function destroy(id) {
  return request({
    url: 'power/destroy/' + id,
    method: 'POST'
  })
}
