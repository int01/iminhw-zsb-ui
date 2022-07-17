import request from '@/utils/request'

// 查询通知书数据列表
export function listMatview(query) {
  return request({
    url: '/stu/matview/list',
    method: 'get',
    params: query
  })
}

// 查询通知书数据详细
export function getMatview(xh) {
  return request({
    url: '/stu/matview/' + xh,
    method: 'get'
  })
}
