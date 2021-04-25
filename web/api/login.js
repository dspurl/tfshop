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
export function emailCode(data) {
  data = Qs.parse(data)
  return request({
    url: 'emailCode',
    method: 'POST',
    data
  })
}
export function verifyEmail(data) {
  data = Qs.parse(data)
  return request({
    url: 'verifyEmail',
    method: 'POST',
    data
  })
}
export function findPassword(data) {
  data = Qs.parse(data)
  return request({
    url: 'findPassword',
    method: 'POST',
    data
  })
}
export function changeCellphone(data) {
  data = Qs.parse(data)
  return request({
    url: 'changeCellphone',
    method: 'POST',
    data
  })
}
export function amendPassword(data) {
  data = Qs.parse(data)
  return request({
    url: 'amendPassword',
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
