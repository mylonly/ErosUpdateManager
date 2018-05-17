import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/package/list',
    method: 'get',
    params: query
  })
}

export function fetchDetail() {
  return request({
    url: '/package/detail',
    method: 'get'
  })
}

export function updatePackage(data) {
  return request({
    url: '/package/update',
    method: 'post',
    data
  })
}

export function createPackage(data) {
  return request({
    url: '/package/create',
    method: 'post',
    data
  })
}

export function packageVersion(query) {
  return request({
    url: '/package/version',
    method: 'get',
    params: query
  })
}
