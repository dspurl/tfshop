import request from '@/utils/request'
export function getList() {
  return request({
    url: 'plugin',
    method: 'get'
  })
}

export function create(name) {
  return request({
    url: 'plugin/' + name,
    method: 'get'
  })
}

export function destroy(name) {
  return request({
    url: 'plugin/destroy/' + name,
    method: 'post'
  })
}
