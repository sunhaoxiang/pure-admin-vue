import type { BasePageList } from '@/types/base'
import type { MenuTree } from '@/types/menu'
import type { AuthTokens, LoginInfo, User, UserInfo, UserListParams } from '@/types/user'

import { http } from '@/utils/http'

export function loginApi(data: LoginInfo): Promise<AuthTokens> {
  return http.post('/user/login', data)
}

export function getUserInfoApi(): Promise<UserInfo> {
  return http.get('/user/info')
}

export function getUserMenuApi(): Promise<MenuTree> {
  return http.get('/menu/tree')
}

export function getUserListApi(params: UserListParams = { page: 1, pageSize: 10 }): Promise<BasePageList<User>> {
  return http.get('/user/list', { params })
}

export function getUserApi(id: string): Promise<User> {
  return http.get(`/user/${id}`)
}

export function createUserApi(data: Omit<User, 'id'>): Promise<User> {
  return http.post('/user', data)
}

export function updateUserApi(data: Partial<User>): Promise<User> {
  return http.put(`/user/${data.id}`, data)
}

export function deleteUserApi(id: string): Promise<void> {
  return http.delete(`/user/${id}`)
}
