import type { FormProps, TableProps } from 'ant-design-vue'
import type { Ref } from 'vue'

import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, isRef, ref, unref } from 'vue'
import { useRoute } from 'vue-router'

import type { ApiResponse, BasePageList, BasePageParams } from '@/types/base'

import { usePageTransfer } from '@/hooks/usePageTransfer'

interface UseTableOptions<TData, TParams extends BasePageParams> {
  apiFn: (params?: TParams) => Promise<TData>
  pagination?: boolean
  key: string
  cacheEnabled?: boolean
  dataStaleTime?: number
  form: Omit<TParams, 'page' | 'pageSize'>
  rules?: FormProps['rules']
  columns: Ref<TableProps['columns']> | TableProps['columns']
  idKey?: string
  scrollX?: string
  scrollY?: Ref<number | undefined> | number | undefined
  pageCreatePath?: string
  pageEditPath?: string
}

// 定义查询参数的类型
interface QueryState<TParams> {
  params: TParams
  page: number
  pageSize: number
}

// 辅助函数：判断是否为分页响应
function isPageResponse<T>(data: ApiResponse<T>): data is BasePageList<T> {
  return !Array.isArray(data) && 'total' in data && 'list' in data
}

export function useTable<TItem, TParams extends BasePageParams>({
  key,
  cacheEnabled = true, // 是否启用缓存，默认启用
  dataStaleTime = 1000 * 60 * 10, // 默认 10 分钟内数据保持新鲜
  apiFn,
  pagination = true,
  form = {} as Omit<TParams, 'page' | 'pageSize'>,
  idKey = 'id',
  rules = {},
  columns,
  scrollX = '100%',
  scrollY = undefined,
  pageCreatePath, // 新建页面路径
  pageEditPath, // 编辑页面路径
}: UseTableOptions<ApiResponse<TItem>, TParams>) {
  const route = useRoute()
  const listQueryKey = `${key}-list`
  const stateQueryKey = `${key}-list-state`

  // -------------------- State Management --------------------
  // 分页状态
  const page = ref(1)
  const pageSize = ref(10)

  // 表单状态
  const formRef = ref()
  const formState = ref({ ...unref(form) })
  const queryState = ref({ ...unref(form) })
  const formRules = rules

  // -------------------- Cache Management --------------------
  const queryClient = useQueryClient()

  // 保存查询状态
  function saveQueryState() {
    if (cacheEnabled) {
      const state: QueryState<TParams> = {
        params: { ...formState.value },
        page: page.value,
        pageSize: pageSize.value,
      }
      queryClient.setQueryData([stateQueryKey], state)
    }
  }

  // 清除保存的查询状态
  function clearSavedState() {
    if (cacheEnabled) {
      queryClient.removeQueries({ queryKey: [stateQueryKey] })
    }
  }

  if (cacheEnabled) {
    // 初始化状态
    const initialState = queryClient.getQueryData<QueryState<TParams>>([stateQueryKey])

    if (initialState) {
      formState.value = { ...initialState.params }
      queryState.value = { ...initialState.params }
      if (pagination) {
        page.value = initialState.page
        pageSize.value = initialState.pageSize
      }
    }
  }

  // -------------------- Query & Data Fetching --------------------
  const { data, refetch, isFetching } = useQuery<ApiResponse<TItem>, Error>({
    queryKey: [listQueryKey],
    queryFn: () => {
      const params = {
        ...queryState.value,
        ...(pagination ? { page: page.value, pageSize: pageSize.value } : {}),
      } as TParams
      return apiFn(params)
    },
    staleTime: cacheEnabled ? dataStaleTime : 0,
    gcTime: cacheEnabled ? dataStaleTime : 0,
  })

  // -------------------- Computed Properties --------------------
  const list = computed(() => {
    if (!data.value)
      return []
    return isPageResponse(data.value) ? data.value.list : data.value
  })

  const total = computed(() => {
    if (!data.value)
      return 0
    return isPageResponse(data.value) ? data.value.total : data.value.length
  })

  // -------------------- Actions --------------------
  function handleSearch() {
    queryState.value = { ...formState.value }
    if (pagination) {
      page.value = 1
    }
    saveQueryState()
    refetch()
  }

  function handleReset() {
    formRef.value?.resetFields?.()
    queryState.value = { ...formState.value }
    if (pagination) {
      page.value = 1
      pageSize.value = 10
    }
    saveQueryState()
    refetch()
  }

  async function handleCreate(transferData = null, query = {}) {
    const { navigateWithData } = usePageTransfer()
    if (pageCreatePath) {
      navigateWithData(
        {
          path: pageCreatePath,
          query,
        },
        transferData,
      )
    }
    else {
      navigateWithData(
        {
          path: `${route.path}/create/new`,
          query,
        },
        transferData,
      )
    }
    // navigateWithData(
    //   {
    //     path: pageCreatePath,
    //     query,
    //   },
    //   transferData,
    // )
  }

  async function handleEdit() {}

  async function handleDelete() {}

  // -------------------- Table Props --------------------
  const tableProps = computed(() => ({
    columns: isRef(columns) ? columns.value : columns,
    dataSource: list.value,
    scroll: {
      x: scrollX,
      y: isRef(scrollY) ? scrollY.value : scrollY,
    },
    rowKey: idKey,
    loading: isFetching.value,
    sticky: true,
    pagination: pagination
      ? {
          current: page.value,
          pageSize: pageSize.value,
          total: total.value,
          onChange: (newPage: number, newPageSize: number) => {
            page.value = newPage
            pageSize.value = newPageSize
            refetch()
            saveQueryState()
          },
        }
      : false,
  }))

  return {
    // 表单
    formRef,
    formState,
    formRules,

    // 表格
    tableProps,

    // 数据
    isLoading: isFetching,
    data,
    list,
    total,

    // 事件
    handleSearch,
    handleReset,
    handleCreate,
    handleEdit,
    handleDelete,

    // 清除状态
    clearSavedState,

    // 分页状态
    ...(pagination
      ? {
          currentPage: page,
          currentPageSize: pageSize,
        }
      : {}),
  }
}
