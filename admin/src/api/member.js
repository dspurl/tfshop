import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'member',
    method: 'get',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'member',
    method: 'post',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'member/' + data.id,
    method: 'post',
    data
  })
}
