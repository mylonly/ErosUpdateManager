import request from '@/utils/request'

export function recordList(query) {
  return request({
    url: '/release/records',
    method: 'get',
    params: query
  })
}

export function updateRecordMemo(data) {
  return request({
    url: '/release/recordmemo',
    method: 'post',
    data
  })
}

export function addRelease(data) {
  return request({
    url: '/release/add',
    method: 'post',
    data
  })
}

export function jsVersions() {
  return request({
    url: 'release/jsVersions',
    method: 'get'
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
export function deleteReleaseByPackage(jsMD5) {
  const data = {
    'jsMD5': jsMD5
  }
  return request({
    url: '/release/deleteByPackage',
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
