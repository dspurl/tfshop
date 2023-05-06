import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'config',
    method: 'GET',
    params: query
  })
}
export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'config/' + data.id,
    method: 'POST',
    data
  })
}
