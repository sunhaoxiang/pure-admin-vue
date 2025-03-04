import type { API_TYPE, API_METHOD } from '@/constants/api'

export interface Api {
  id: number
  parentId: number | null
  title: string
  code?: string
  type: API_TYPE
  method?: API_METHOD
  path?: string
  children?: Api[]
}

export type ApiTree = Api[]

export type FlatApi = Omit<Api, 'children'>
