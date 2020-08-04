import request from '@/utils/request'
import Qs from 'qs'
export function listTemplates(query) {
  return request({
    url: 'listTemplates',
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

export function deleteListTemplates(id, data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'listTemplates/' + id,
    method: 'DELETE',
    data
  })
}
