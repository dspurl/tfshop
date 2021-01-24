import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'plugin',
    method: 'get',
    params: query
  })
}

export function createSubmit(name) {
  return request({
    url: 'plugin/' + name,
    method: 'PUT'
  })
}

export function updateSubmit(id, data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'plugin/' + id,
    method: 'POST',
    data
  })
}

export function deleteSubmit(name) {
  return request({
    url: 'plugin/' + name,
    method: 'DELETE'
  })
}
