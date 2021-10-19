import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'plugin',
    method: 'GET',
    params: query
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
    url: 'plugin/' + data.abbreviation,
    method: 'POST',
    data
  })
}

export function publish(name) {
  return request({
    url: 'plugin/publish/' + name,
    method: 'POST'
  })
}

export function updatePack(code, data) {
  data = Qs.parse(data)
  return request({
    url: 'plugin/updatePack/' + code,
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

export function routes() {
  return request({
    url: 'plugin/routes/no_get',
    method: 'GET'
  })
}

export function models() {
  return request({
    url: 'plugin/models/all',
    method: 'GET'
  })
}

export function template(name) {
  return request({
    url: 'plugin/template/' + name,
    method: 'GET'
  })
}

export function jurisdiction(data) {
  return request({
    url: 'plugin/jurisdiction/all',
    method: 'POST',
    data
  })
}

export function diff(name) {
  return request({
    url: 'plugin/diff/' + name,
    method: 'GET'
  })
}

export function conflictResolution(name, data) {
  return request({
    url: 'plugin/conflictResolution/' + name,
    method: 'POST',
    data
  })
}

export function installList() {
  return request({
    url: 'plugin/installList/all',
    method: 'GET'
  })
}

