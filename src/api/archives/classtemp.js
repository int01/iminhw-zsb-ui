import request from '@/utils/request'

// 查询档案收录缓存列表
export function listClasstemp(query) {
  return request({
    url: '/archives/classtemp/list',
    method: 'get',
    params: query
  })
}

// 查询档案收录缓存详细
export function getClasstemp(id) {
  return request({
    url: '/archives/classtemp/' + id,
    method: 'get'
  })
}

// 新增档案收录缓存
export function addClasstemp(data) {
  return request({
    url: '/archives/classtemp',
    method: 'post',
    data: data
  })
}

// 修改档案收录缓存
export function updateClasstemp(data) {
  return request({
    url: '/archives/classtemp',
    method: 'put',
    data: data
  })
}

// 删除档案收录缓存
export function delClasstemp(id) {
  return request({
    url: '/archives/classtemp/' + id,
    method: 'delete'
  })
}
