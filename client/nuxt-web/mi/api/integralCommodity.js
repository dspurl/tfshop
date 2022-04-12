import request from '@/plugins/request'
import Qs from 'qs'
export function getDetail(data) {
  data = Qs.parse(data)
  return request({
    url: 'integralCommodity',
    method: 'POST',
    data
  })
}