import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'resource',
    method: 'get',
    params: query
  })
}

export function setDelete(id, data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'resource/' + id,
    method: 'DELETE',
    data
  })
}

