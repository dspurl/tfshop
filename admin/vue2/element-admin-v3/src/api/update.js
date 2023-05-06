import request from '@/utils/request'
import Qs from 'qs'
export function detail() {
  return request({
    url: 'update',
    method: 'GET'
  })
}
export function edit(step, data) {
  data = Qs.parse(data)
  return request({
    url: 'update/' + step,
    method: 'POST',
    data
  })
}
