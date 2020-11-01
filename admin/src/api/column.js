import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'column',
    method: 'get',
    params: query
  })
}

export function createSubmit(data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'column',
    method: 'POST',
    data
  })
}

export function getShow(id) {
  return request({
    url: 'column/' + id,
    method: 'get'
  })
}

export function updateSubmit(id, data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'column/' + id,
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
    url: 'column/' + id,
    method: 'DELETE',
    data
  })
}

