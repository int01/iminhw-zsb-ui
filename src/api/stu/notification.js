import request from '@/utils/request'

// 查询通知书邮寄记录列表
export function listNotification(query) {
  return request({
    url: '/stu/notification/list',
    method: 'get',
    params: query
  })
}

// 查询通知书邮寄记录详细
export function getNotification(ksh) {
  return request({
    url: '/stu/notification/' + ksh,
    method: 'get'
  })
}

// 新增通知书邮寄记录
export function addNotification(data) {
  return request({
    url: '/stu/notification',
    method: 'post',
    data: data
  })
}

// 修改通知书邮寄记录
export function updateNotification(data) {
  return request({
    url: '/stu/notification',
    method: 'put',
    data: data
  })
}

// 删除通知书邮寄记录
export function delNotification(ksh) {
  return request({
    url: '/stu/notification/' + ksh,
    method: 'delete'
  })
}
