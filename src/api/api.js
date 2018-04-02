import axios from 'axios'
import { Message, Spin } from 'iview'
// import errors from '../config/errors'
// import router from '@/router'

// 超时时间
// axios.defaults.timeout = 10000

axios.interceptors.request.use(
  config => {
    Spin.show()
    config.headers['Authorization'] = localStorage.getItem('token')
    return config
  },
  error => {
    Spin.hide()
    Message.error('请求超时，请稍后重试！')
    return Promise.reject(error)
  }
)
// http响应拦截器
axios.interceptors.response.use(
  res => {
    // const tokeError = Object.keys(errors.tokeError)

    // if (tokeError.indexOf(`${res.data.code}`) > -1) {
    //   router.push({ path: '/' })
    // }
    Spin.hide()
    return res
  },
  error => {
    Spin.hide()
    Message.error('请求失败，请稍后重试！')
    return Promise.reject(error)
  }
)

export default axios
