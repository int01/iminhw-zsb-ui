import request from '@/utils/request'

// hpcount
export function getHongPageCount() {
  return request({
    url: '/analysis/index/hpcount',
    method: 'get',
  })
}

