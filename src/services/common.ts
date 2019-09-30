import request from './api'

/**
 * 获取阿里云上传 access key
 * @param params
 * type: string 不同的类型
 */
export const queryOss = (params: any) =>
  request.post('/aliyun/oss/sts_token', { params })

// 获取魔法校季度列表
export function getYearTerm<T>(data:ITermParams):Promise<T> {
  return request.get('/data_center/years_terms', { params: data })
}
