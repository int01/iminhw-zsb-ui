import request from '@/utils/request'

// 查询邮寄档案列表
export function listEms(query) {
  return request({
    url: '/archives/ems/list',
    method: 'get',
    params: query
  })
}

// 查询邮寄档案详细
export function getEms(id) {
  return request({
    url: '/archives/ems/' + id,
    method: 'get'
  })
}

// 新增邮寄档案
export function addEms(data) {
  return request({
    url: '/archives/ems',
    method: 'post',
    data: data
  })
}

// 修改邮寄档案
export function updateEms(data) {
  return request({
    url: '/archives/ems',
    method: 'put',
    data: data
  })
}

// 删除邮寄档案
export function delEms(id) {
  return request({
    url: '/archives/ems/' + id,
    method: 'delete'
  })
}

// 验证快递实体
export function verifyKddh(data){
  return request({
    url: '/archives/ems/verify',
    method: 'put',
    data: data
  })
}

// 更新插袋实体记录
export function unpackEms(data){
  return request({
    url: '/archives/ems/unpack',
    method: 'put',
    data: data
  })
}

// unpackUnusual
export function unpackUnusual(query){
  return request({
    url: '/archives/ems/unpack/unusual',
    method: 'get',
    params: query
  })
}

// 查询邮寄档案详细
export function getMaxXhEms(yearStr) {
  return request({
    url: '/archives/ems/datemaxxh/' + yearStr,
    method: 'get'
  })
}
