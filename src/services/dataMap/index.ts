/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-04 17:10:48
 * @LastEditTime: 2019-11-03 18:40:11
 * @LastEditors: Please set LastEditors
 */
import request from '@/services/api'

// 获取所有用户
export function getAllUser<T>(): Promise<T> {
  return request.post('/api/userAll')
}
// 编辑设备
export function EditDevice<T>(): Promise<T> {
  return request.post('/api/device_editor')
}

// 添加设备
export function addDevice<T>(): Promise<T> {
  return request.post('/api/device_add')
}
interface IDeviceList {
  page: number,
  perpage: number,
}
// 获取设备位置列表
export function getDeviceMarkerList<T>(data: IDeviceList): Promise<T> {
  return request.post('/api/markers', data)
}

// 获取设备历史轨迹
export function getDeviceTracks<T>(imei: number): Promise<T> {
  return request.post('/api/device_tracks', { imei })
}

// 获取实时追踪信息
export function getTimeTracks<T>(imei: number): Promise<T> {
  return request.post('/api/time_tracks', { imei })
}
// 获取报警设备列表
export function getWarnDeviceMarkers<T>(): Promise<T> {
  return request.get('/api/warn_markers')
}
