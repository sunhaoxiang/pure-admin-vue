<script setup lang="ts">
import enUS from 'ant-design-vue/es/locale/en_US'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()
const { antdTheme, currentLocale } = storeToRefs(appStore)

const antdLocale = computed(() => {
  switch (currentLocale.value) {
    case 'en-US':
      return enUS
    case 'zh-CN':
      return zhCN
    default:
      return zhCN
  }
})
</script>

<template>
  <a-config-provider :locale="antdLocale" :theme="antdTheme">
    <a-app>
      <RouterView />
    </a-app>
  </a-config-provider>
</template>
