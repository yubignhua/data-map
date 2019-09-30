/// <reference path="./index.d.ts" />

import request from '@/services/api'

// 请求机构排名列表
export function getDtsRankList<T>(data:IDtsRankParm):Promise<T> {
  return request.get('/data_center/school_rank', { params: data })
}

// 机构排名导出
export function exportDtsRank<T>(data:IDtsRankParm):Promise<T> {
  return request.get('/data_center/export_school_rank', { params: data })
}

// 获取首页信息列表
export function getIndexData<T>():Promise<T> {
  return request.get('/data_center/index')
}

// 机构雷达
export function getRadarSchool<T>(data:IRadarParam):Promise<T> {
  return request.get('/data_center/radar_schools', { params: data })
}

// 机构运营详情
export function getRadarSchoolDetail<T>(data:{school_id:number}):Promise<T> {
  return request.get('/data_center/radar_school', { params: data })
}
