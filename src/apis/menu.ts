import type { Menu, MenuTree } from '@/types/menu'

import { http } from '@/utils/http'

export function getMenuTreeApi(): Promise<MenuTree> {
  return http.get('/menu/tree')
}

export function getMenuApi(id: number): Promise<Omit<Menu, 'children'>> {
  return http.get(`/menu/${id}`)
}

export function createMenuApi(data: Omit<Menu, 'id' | 'children'>): Promise<Menu> {
  return http.post('/menu', data)
}

export function updateMenuApi(id: number, data: Partial<Omit<Menu, 'children'>>): Promise<Menu> {
  return http.put(`/menu/${id}`, data)
}

export function deleteMenuApi(id: number): Promise<void> {
  return http.delete(`/menu/${id}`)
}
