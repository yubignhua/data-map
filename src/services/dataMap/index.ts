/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-04 17:10:48
 * @LastEditTime: 2019-11-22 23:09:55
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

interface IAddDevice {
  imei: string,
  device_name: string,
}

// 添加设备
export function addDevice<T>(data: IAddDevice): Promise<T> {
  return request.post('/api/device_add', data)
}
interface IDeviceList {
  page: number,
  perpage: number,
}
// 获取设备位置列表
export function getDeviceList<T>(data: any[]): Promise<T> {
  return request.post('/api/markers', data)
}

// 获取设备位置列表
export function getDeviceMarkerList<T>(data: any): Promise<T> {
  return request.post('/api/time_tracks', data)
}

// 搜索设备
export function searchData<T>(data: any): Promise<T> {
  return request.post('/api/markers_search',data)
}


// 获取设备位置列表
export function getUserList<T>(data: IDeviceList): Promise<T> {
  return request.post('/api/markers_user', data)
}

// 获取报警设备位置列表
export function getWarnDeviceMarkerList<T>(data: any): Promise<T> {
  return request.post('/api/warn_markers_imei', data)
}

// 获取设备历史轨迹
export function getDeviceTracks<T>(imei: number): Promise<T> {
  // return request.post('/api/device_tracks', { imei })
  return request.post('/api/device_tracks_wifi_gps', { imei })
}


// 获取实时追踪信息
export function getTimeTracks<T>(imei: number): Promise<T> {
  return request.post('/api/time_tracks', { imei })
}
// 获取报警设备列表
export function getWarnDeviceMarkers<T>(): Promise<T> {
  return request.get('/api/warn_markers')
}

