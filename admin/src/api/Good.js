import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'Good',
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
    url: 'Good',
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
    url: 'Good/' + id,
    method: 'PUT',
    data
  })
}

export function setState(id, data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'GoodState/' + id,
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
    url: 'Good/' + id,
    method: 'DELETE',
    data
  })
}

export function getShow(id, query) {
  return request({
    url: 'Good/' + id,
    method: 'GET',
    params: query
  })
}

export function getSpecification(id) {
  return request({
    url: 'goodSpecification/' + id,
    method: 'GET'
  })
}
