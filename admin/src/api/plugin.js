import request from '@/utils/request'
export function getList() {
  return request({
    url: 'plugin',
    method: 'GET'
  })
}

export function create(name) {
  return request({
    url: 'plugin/' + name,
    method: 'GET'
  })
}

export function destroy(name) {
  return request({
    url: 'plugin/destroy/' + name,
    method: 'POST'
  })
}
