import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'article',
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
    url: 'article',
    method: 'POST',
    data
  })
}

export function getShow(id) {
  return request({
    url: 'article/' + id,
    method: 'get'
  })
}

export function updateSubmit(id, data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'article/' + id,
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
    url: 'article/' + id,
    method: 'DELETE',
    data
  })
}

