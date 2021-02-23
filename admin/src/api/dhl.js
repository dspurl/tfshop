import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'dhl',
    method: 'GET',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'dhl',
    method: 'POST',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'dhl/' + data.id,
    method: 'POST',
    data
  })
}

export function destroy(id) {
  return request({
    url: 'dhl/destroy/' + id,
    method: 'POST'
  })
}
