import request from '@/utils/request'

// 查询剩余档案列表
export function listRemain(query) {
  return request({
    url: '/archives/remain/list',
    method: 'get',
    params: query
  })
}

// 查询剩余档案详细
export function getRemain(id) {
  return request({
    url: '/archives/remain/' + id,
    method: 'get'
  })
}

// 新增剩余档案
export function addRemain(data) {
  return request({
    url: '/archives/remain',
    method: 'post',
    data: data
  })
}

// 修改剩余档案
export function updateRemain(data) {
  return request({
    url: '/archives/remain',
    method: 'put',
    data: data
  })
}

// 删除剩余档案
export function delRemain(id) {
  return request({
    url: '/archives/remain/' + id,
    method: 'delete'
  })
}
