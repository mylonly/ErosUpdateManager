import axios from 'axios'
import { Message } from 'element-ui'
/* import store from '@/store'
import { getToken } from '@/utils/auth'*/

// create an axios instance

const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000, // request timeout
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFTOKEN',
  xsrfCookieName: 'csrftoken'
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  /* if (store.getters.token) {
    config.headers['X-CSRFToken'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  console.log('config:', config)*/
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    const responseData = response.data
    if (responseData.status !== 0) {
      Message({
        message: responseData.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(responseData)
    } else {
      return responseData
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
