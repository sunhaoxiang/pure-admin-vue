<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { Icon } from '@/components/icon'
import { useAppStore } from '@/stores/appStore'

const router = useRouter()

const appStore = useAppStore()
const { headerHeight, sidebarCollapsed } = storeToRefs(appStore)

const logoStyle = computed(() => ({
  height: `${headerHeight.value}px`,
}))

function handleClick() {
  router.push('/')
}

const title = computed(() => import.meta.env.VITE_APP_TITLE)
</script>

<template>
  <div
    class="flex cursor-pointer select-none items-center justify-center gap-3 dark:text-theme-dark text-theme"
    :style="logoStyle"
    @click="handleClick"
  >
    <Icon icon="icon-local:logo" class="text-3xl" />
    <h2
      v-show="!sidebarCollapsed"
      class="mb-0 block overflow-hidden whitespace-nowrap text-xl font-bold"
    >
      {{ title }}
    </h2>
  </div>
</template>
