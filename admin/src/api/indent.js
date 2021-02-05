import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'indent',
    method: 'get',
    params: query
  })
}

export function detail(id) {
  return request({
    url: 'indent/' + id,
    method: 'get'
  })
}

export function shipment(data) {
  data = Qs.parse(data)
  return request({
    url: 'indent/shipment',
    method: 'post',
    data
  })
}

export function dhl(data) {
  data = Qs.parse(data)
  return request({
    url: 'indent/dhl',
    method: 'post',
    data
  })
}

export function query(id) {
  return request({
    url: 'indent/query/' + id,
    method: 'get'
  })
}

export function refund(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'indent/refund/' + id,
    method: 'post',
    data
  })
}
