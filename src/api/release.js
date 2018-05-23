import request from '@/utils/request'

export function recordList(query) {
  return request({
    url: '/release/records',
    method: 'get',
    params: query
  })
}

export function addRelease(data) {
  return request({
    url: '/release/add',
    method: 'post',
    data
  })
}

export function releaselist(query) {
  return request({
    url: '/release/list',
    method: 'get',
    params: query
  })
}

export function updateRelease(data) {
  return request({
    url: '/release/update',
    method: 'post',
    data
  })
}

export function deleteRelease(data) {
  return request({
    url: '/release/delete',
    method: 'post',
    data
  })
}

export function queryProgress(data) {
  return request({
    url: '/release/progress',
    method: 'post',
    data
  })
}
