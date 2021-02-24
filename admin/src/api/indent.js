import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'indent',
    method: 'GET',
    params: query
  })
}

export function detail(id) {
  return request({
    url: 'indent/' + id,
    method: 'GET'
  })
}

export function shipment(data) {
  data = Qs.parse(data)
  return request({
    url: 'indent/shipment',
    method: 'POST',
    data
  })
}

export function dhl(data) {
  data = Qs.parse(data)
  return request({
    url: 'indent/dhl',
    method: 'POST',
    data
  })
}

export function query(id) {
  return request({
    url: 'indent/query/' + id,
    method: 'GET'
  })
}

export function refund(id, data) {
  data = Qs.parse(data)
  return request({
    url: 'indent/refund/' + id,
    method: 'POST',
    data
  })
}

export function receiving(data) {
  data = Qs.parse(data)
  return request({
    url: 'indent/receiving',
    method: 'POST',
    data
  })
}
