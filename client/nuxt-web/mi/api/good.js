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
import request from '@/plugins/request'
export function getList(query) {
  return request({
    url: 'good',
    method: 'GET',
    params: query
  })
}
export function detail(id) {
  return request({
    url: 'good/' + id,
    method: 'GET'
  })
}
export function goodCategory(query) {
  return request({
    url: 'goodCategory',
    method: 'GET',
    params: query
  })
}
