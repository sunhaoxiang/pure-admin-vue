<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import type { MENU_TYPE } from '@/constants/menu'

import { getMenuPermissionApi } from '@/apis/menu'

const { type } = defineProps<{
  type: MENU_TYPE.MENU | MENU_TYPE.FEATURE
}>()

const value = defineModel<string[]>('value')

const { data } = useQuery({
  queryKey: ['menuPermission', type],
  queryFn: () => getMenuPermissionApi(type),
})

const options = computed(() => {
  return data.value?.map(item => ({
    label: item.title,
    value: item.code,
  }))
})
</script>

<template>
  <div>
    <a-select
      v-model:value="value"
      :options="options"
      mode="multiple"
      allow-clear
    />
  </div>
</template>
