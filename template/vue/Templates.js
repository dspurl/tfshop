import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'vueTemplate',
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
    url: 'vueTemplate',
    method: 'POST',
    data
  })
}

export function edit(id, data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'vueTemplate/' + id,
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
    url: 'vueTemplate/' + id,
    method: 'DELETE',
    data
  })
}

export function getShow(id) {
  return request({
    url: 'vueTemplate/' + id,
    method: 'GET'
  })
}
