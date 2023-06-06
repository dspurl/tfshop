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
