/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-04 17:10:48
 * @LastEditTime: 2019-10-19 12:42:55
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

// 获取设备位置列表
export function getDeviceMarkerList<T>(): Promise<T> {
  return request.get('/api/markers')
}

// 获取设备历史轨迹
export function getDeviceTracks<T>(): Promise<T> {
  return request.get('/api/device_tracks')
}

// 获取实时追踪信息
export function getTimeTracks<T>(): Promise<T> {
  return request.get('/api/time_tracks')
}
// 获取报警设备列表
export function getWarnDeviceMarkers<T>(): Promise<T> {
  return request.get('/api/warn_markers')
}

