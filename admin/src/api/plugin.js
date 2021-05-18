import request from '@/utils/request'
import Qs from 'qs'
export function getList() {
  return request({
    url: 'plugin',
    method: 'GET'
  })
}

export function install(name) {
  return request({
    url: 'plugin/install/' + name,
    method: 'GET'
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'plugin',
    method: 'POST',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'plugin/' + data.name,
    method: 'POST',
    data
  })
}

export function details(name) {
  return request({
    url: 'plugin/' + name,
    method: 'GET'
  })
}

export function destroy(name) {
  return request({
    url: 'plugin/destroy/' + name,
    method: 'POST'
  })
}

export function uninstall(name) {
  return request({
    url: 'plugin/uninstall/' + name,
    method: 'POST'
  })
}
