import request from '@/utils/request'
export function getList(query) {
  return request({
    url: 'deviceLog',
    method: 'get',
    params: query
  })
}

