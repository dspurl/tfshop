/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
import request from '@/utils/request'
import Qs from 'qs'
export function getList(query) {
  return request({
    url: 'plugin',
    method: 'GET',
    params: query
  })
}

export function install(name) {
  return request({
    url: 'plugin/install/' + name,
    method: 'GET'
  })
}

export function create(data) {
  data = Qs.parse(data)
  return request({
    url: 'plugin',
    method: 'POST',
    data
  })
}

export function edit(data) {
  data = Qs.parse(data)
  return request({
    url: 'plugin/' + data.abbreviation,
    method: 'POST',
    data
  })
}

export function publish(name) {
  return request({
    url: 'plugin/publish/' + name,
    method: 'POST'
  })
}

export function updatePack(code, data) {
  data = Qs.parse(data)
  return request({
    url: 'plugin/updatePack/' + code,
    method: 'POST',
    data
  })
}

export function details(name) {
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

export function uninstall(name) {
  return request({
    url: 'plugin/uninstall/' + name,
    method: 'POST'
  })
}

export function routes() {
  return request({
    url: 'plugin/routes/no_get',
    method: 'GET'
  })
}

export function models() {
  return request({
    url: 'plugin/models/all',
    method: 'GET'
  })
}

export function template(name) {
  return request({
    url: 'plugin/template/' + name,
    method: 'GET'
  })
}

export function jurisdiction(data) {
  return request({
    url: 'plugin/jurisdiction/all',
    method: 'POST',
    data
  })
}

export function diff(name) {
  return request({
    url: 'plugin/diff/' + name,
    method: 'GET'
  })
}

export function conflictResolution(name, data) {
  return request({
    url: 'plugin/conflictResolution/' + name,
    method: 'POST',
    data
  })
}

export function installList() {
  return request({
    url: 'plugin/installList/all',
    method: 'GET'
  })
}

export function verifyPlugin(name) {
  return request({
    url: 'verifyPlugin/' + name,
    method: 'POST'
  })
}
