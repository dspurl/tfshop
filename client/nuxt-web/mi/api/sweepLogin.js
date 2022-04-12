import request from '@/plugins/request'
import Qs from 'qs'
export function code() {
  return request({
    url: 'sweepLogin',
    method: 'GET'
  })
}
export function verify(data) {
  data = Qs.parse(data)
  return request({
    url: 'sweepLogin/verify',
    method: 'POST',
    data
  })
}
export function index(data) {
  data = Qs.parse(data)
  return request({
    url: 'sweepLogin',
    method: 'POST',
    data
  })
}
