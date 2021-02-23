import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'member',
    method: 'GET',
    params: query
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'member',
    method: 'POST',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'member/' + data.id,
    method: 'POST',
    data
  })
}
