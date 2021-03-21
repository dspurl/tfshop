import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/plugins/auth'
const service = axios.create({
  baseURL: process.env.API_URL,
  timeout: 50000
})
service.interceptors.request.use(
  config => {
    config.headers['apply-secret'] = process.env.PROJECT_KEY
    config.headers['Accept'] = 'application/json'
    config.headers['Authorization'] = 'Bearer ' + getToken('token')
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
        message: '服务器返回格式有误',
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
    Message({
      message: error.response.data.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
