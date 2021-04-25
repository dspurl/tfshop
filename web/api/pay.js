import request from '@/plugins/request'
import Qs from 'qs'
export function unifiedPayment(data) {
  data = Qs.parse(data)
  return request({
    url: 'unifiedPayment',
    method: 'POST',
    data
  })
}
export function balancePay(data) {
  data = Qs.parse(data)
  return request({
    url: 'balancePay',
    method: 'POST',
    data
  })
}
