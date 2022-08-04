import request from '@/utils/request'

// 查询录取数据统计列表
export function listMatriculate(query) {
  return request({
    url: '/analysis/matriculate/list',
    method: 'get',
    params: query
  })
}