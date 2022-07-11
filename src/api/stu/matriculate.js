import request from '@/utils/request'

// 查询录取数据列表
export function listMatriculate(query) {
  return request({
    url: '/stu/matriculate/list',
    method: 'get',
    params: query
  })
}

// 查询录取数据详细
export function getMatriculate(ksh) {
  return request({
    url: '/stu/matriculate/' + ksh,
    method: 'get'
  })
}

// 新增录取数据
export function addMatriculate(data) {
  return request({
    url: '/stu/matriculate',
    method: 'post',
    data: data
  })
}

// 修改录取数据
export function updateMatriculate(data) {
  return request({
    url: '/stu/matriculate',
    method: 'put',
    data: data
  })
}

// 删除录取数据
export function delMatriculate(ksh) {
  return request({
    url: '/stu/matriculate/' + ksh,
    method: 'delete'
  })
}
