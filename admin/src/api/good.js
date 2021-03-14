import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'good',
    method: 'GET',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'good',
    method: 'POST',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'good/' + data.id,
    method: 'POST',
    data
  })
}

export function destroy(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'good/destroy/' + id,
    method: 'POST',
    data
  })
}

export function detail(id) {
  return request({
    url: 'good/' + id,
    method: 'GET'
  })
}

export function state(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'good/state/' + id,
    method: 'POST',
    data
  })
}

export function specification(id) {
  return request({
    url: 'good/specification/' + id,
    method: 'GET'
  })
}
