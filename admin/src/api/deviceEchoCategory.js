import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'deviceEchoCategory',
    method: 'get',
    params: query
  })
}

export function updateSubmit(id, data) {
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: 'deviceEchoCategory/' + id,
    method: 'PUT',
    data
  })
}

