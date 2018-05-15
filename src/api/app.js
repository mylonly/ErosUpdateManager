import request from '@/utils/request'

export function applist(query) {
  return request({
    url: '/app/list',
    method: 'get',
    params: query
  })
}
