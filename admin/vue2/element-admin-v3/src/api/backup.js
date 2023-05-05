import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'backup',
    method: 'GET',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'backup',
    method: 'POST',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'backup/1',
    method: 'POST',
    data
  })
}

export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'backup/destroy/' + id,
    method: 'POST',
    data
  })
}
