import Cookies from 'js-cookie'

// App
const SIDEBAR_STATUS_KEY = 'SIDEBAR_STATUS'
export const getSidebarStatus = () => Cookies.get(SIDEBAR_STATUS_KEY)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(SIDEBAR_STATUS_KEY, sidebarStatus)

// token
const USER_TOKEN_KEY = 'USER_TOKEN'
export const getToken = () => Cookies.get(USER_TOKEN_KEY)
export const setToken = (token: string) => Cookies.set(USER_TOKEN_KEY, token)
export const removeToken = () => Cookies.remove(USER_TOKEN_KEY)

// user info
const USER_NAME_KEY = 'USER_NAME'
export const getUserName = () => Cookies.get(USER_NAME_KEY)
export const setUserName = (info: string) => Cookies.set(USER_NAME_KEY, info)
export const removeUserName = () => Cookies.remove(USER_NAME_KEY)
