import request from '@/utils/request'
import Qs from 'qs'
export function loginByUsername(data) {
  var url = 'login'
  if (!data.type) {
    url = 'gologin'
  }
  data = Qs.parse({
    data
  })
  data = data.data
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/userInfo',
    method: 'get'
  })
}

