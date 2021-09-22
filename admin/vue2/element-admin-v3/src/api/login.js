import request from '@/utils/request'
import Qs from 'qs'
export function loginByUsername(data) {
  data = Qs.parse(data)
  return request({
    url: 'login',
    method: 'POST',
    data
  })
}

export function refreshToken(data) {
  data = Qs.parse(data)
  return request({
    url: 'refreshToken',
    method: 'POST',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/userInfo',
    method: 'GET'
  })
}

