import request from '@/utils/request'
import Qs from 'qs'
export function fetchList(query) {
  return request({
    url: 'admin',
    method: 'get',
    params: query
  })
}

export function createAdmin(data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'admin/create',
    method: 'post',
    data
  })
}

export function amendAdmin(data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'admin',
    method: 'put',
    data
  })
}

export function deleteAdmin(id) {
  return request({
    url: 'admin/' + id,
    method: 'DELETE'
  })
}

export function userList(query) {
  return request({
    url: 'user',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'user',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'user',
    method: 'put',
    data
  })
}

export function manageGroupsList() {
  return request({
    url: 'manage',
    method: 'get'
  })
}

export function createManageGroups(data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'manage/create',
    method: 'post',
    data
  })
}

export function updateManageGroups(data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'manage',
    method: 'put',
    data
  })
}

export function deleteManageGroups(id) {
  return request({
    url: 'manage/' + id,
    method: 'delete'
  })
}

export function powerList(query) {
  return request({
    url: 'power',
    method: 'get',
    params: query
  })
}

export function createPower(data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'power/create',
    method: 'post',
    data
  })
}

export function updatePower(data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'power',
    method: 'put',
    data
  })
}

export function deletePower(id) {
  return request({
    url: 'power/' + id,
    method: 'delete'
  })
}
