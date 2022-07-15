import request from '@/utils/request'

// 查询日志列表
export function list(query) {
  return request({
    url: '/monitor/homevisitlog/list',
    method: 'get',
    params: query
  })
}

// 删除日志
export function delHomevisitlog(visitIds) {
  return request({
    url: '/monitor/homevisitlog/' + visitIds,
    method: 'delete'
  })
}

// 清空日志
export function cleanHomevisitlog() {
  return request({
    url: '/monitor/homevisitlog/clean',
    method: 'delete'
  })
}
