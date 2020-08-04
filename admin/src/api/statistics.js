import request from '@/utils/request'
export function behavior(query) {
  return request({
    url: 'statistic/behavior',
    method: 'get',
    params: query
  })
}
export function keep(query) {
  return request({
    url: 'statistic/keep',
    method: 'get',
    params: query
  })
}
export function source(query) {
  return request({
    url: 'statistic/source',
    method: 'get',
    params: query
  })
}

export function age_and_sex(query) {
  return request({
    url: 'statistic/age_and_sex',
    method: 'get',
    params: query
  })
}

export function pay(query) {
  return request({
    url: 'statistic/pay',
    method: 'get',
    params: query
  })
}
