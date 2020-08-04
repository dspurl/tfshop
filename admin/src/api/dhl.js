import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'dhl',
    method: 'get',
    params: query
  })
}

export function dhlList() {
  return request({
    url: 'dhlList',
    method: 'get'
  })
}

export function createSubmit(data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'dhl',
    method: 'POST',
    data
  })
}

export function updateSubmit(id, data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'dhl/' + id,
    method: 'PUT',
    data
  })
}

export function setDelete(id, data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'dhl/' + id,
    method: 'DELETE',
    data
  })
}
