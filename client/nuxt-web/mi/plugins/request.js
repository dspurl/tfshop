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
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/plugins/auth'
const service = axios.create({
  baseURL: process.env.API_URL,
  timeout: 50000
})
service.interceptors.request.use(
  config => {
    config.headers['apply-secret'] = process.env.PROJECT_KEY
    config.headers['Accept'] = 'application/json'
    config.headers['Authorization'] = getToken('token_type') + ' ' + getToken('token')
    config.headers['Lang'] = getToken('lang') || 'zh'
    return config
  },
  error => {
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.data.result === 'error') {
      Message({
        message: $nuxt.$t('request.error.wrong_format'),
        type: 'error',
        duration: 5 * 1000
      })
    }
    const res = response.data.message
    if (response.status !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // console.log('err' + error) // for debug
    console.log('error.response.data', error.response.data)
    if (error.response.status === 500  && (error.response.data.message.indexOf('The refresh token is invalid') !== -1 || error.response.data.message.indexOf('Unauthenticated') !== -1 || error.response.data.message.indexOf($nuxt.$t('login.timed.out')) !== -1)) {
      $nuxt.$store.commit('logout')
      location.reload()
    } else {
      Message({
        message: error.response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
