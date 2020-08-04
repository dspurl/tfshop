import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'deviceCategory',
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
    url: 'deviceCategory',
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
    url: 'deviceCategory/' + id,
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
    url: 'deviceCategory/' + id,
    method: 'DELETE',
    data
  })
}

