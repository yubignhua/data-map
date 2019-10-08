import request from '@/services/api'

// 机构运营详情
export function getAllUser<T>():Promise<T> {
  return request.get('/api/userAll')
}
