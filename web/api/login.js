import request from '@/plugins/request'
import Qs from 'qs'
export function login(data) {
  data = Qs.parse(data)
  return request({
    url: 'login',
    method: 'POST',
    data
  })
}
export function cellphoneCode(data) {
  data = Qs.parse(data)
  return request({
    url: 'cellphoneCode',
    method: 'POST',
    data
  })
}
export function register(data) {
  data = Qs.parse(data)
  return request({
    url: 'register',
    method: 'POST',
    data
  })
}
