/** +----------------------------------------------------------------------
 * | TFSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉TFSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */
import request from '@/utils/request'
import Qs from 'qs'
export function detail() {
  return request({
    url: 'update',
    method: 'GET'
  })
}
export function edit(step, data) {
  data = Qs.parse(data)
  return request({
    url: 'update/' + step,
    method: 'POST',
    data
  })
}
