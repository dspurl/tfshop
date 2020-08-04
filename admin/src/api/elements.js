import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'elements',
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
    url: 'elements',
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
    url: 'elements/' + id,
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
    url: 'elements/' + id,
    method: 'DELETE',
    data
  })
}

export function getShow(id) {
  return request({
    url: 'elements/' + id,
    method: 'GET'
  })
}

export function getRelevance(type, id) {
  return request({
    url: 'relevance/' + type,
    method: 'GET',
    params: { 'id': id }
  })
}

export function getElementRule(data) {
  return request({
    url: 'elementRule',
    method: 'POST',
    params: { 'element': data }
  })
}
