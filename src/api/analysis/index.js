import request from '@/utils/request'

// hpcount
export function getHongPageCount() {
  return request({
    url: '/analysis/index/hpcount',
    method: 'get',
  })
}
// smbynp
export function getStuMatBythreeYearNumP() {
  return request({
    url: '/analysis/index/smbynp',
    method: 'get',
  })
}
