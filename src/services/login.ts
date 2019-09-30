import request from './api'

interface loginParams {
  mail: string
  password: string
}

export const login = (data: loginParams) =>
  request.post('/user/login', data)
