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
export function behavior(query) {
  return request({
    url: 'statistic/behavior',
    method: 'GET',
    params: query
  })
}
export function keep(query) {
  return request({
    url: 'statistic/keep',
    method: 'GET',
    params: query
  })
}
export function source(query) {
  return request({
    url: 'statistic/source',
    method: 'GET',
    params: query
  })
}

export function age_and_sex(query) {
  return request({
    url: 'statistic/age_and_sex',
    method: 'GET',
    params: query
  })
}

export function pay(query) {
  return request({
    url: 'statistic/pay',
    method: 'GET',
    params: query
  })
}
