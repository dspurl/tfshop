import request from '@/utils/request'
export function getList(query) {
  return request({
    url: 'oauth',
    method: 'get',
    params: query
  })
}

