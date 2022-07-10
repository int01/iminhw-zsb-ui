import request from '@/utils/request'

// 查询档案收集列表
export function listClass(query) {
  return request({
    url: '/archives/class/list',
    method: 'get',
    params: query
  })
}

// 查询档案收集详细
export function getClass(xuehao) {
  return request({
    url: '/archives/class/' + xuehao,
    method: 'get'
  })
}

// 新增档案收集
export function addClass(data) {
  return request({
    url: '/archives/class',
    method: 'post',
    data: data
  })
}

// 修改档案收集
export function updateClass(data) {
  return request({
    url: '/archives/class',
    method: 'put',
    data: data
  })
}

// 删除档案收集
export function delClass(xuehao) {
  return request({
    url: '/archives/class/' + xuehao,
    method: 'delete'
  })
}
