<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import type { Menu } from '@/types/menu'

import { Icon } from '@/components/icon'
import { isHttpUrl } from '@/utils/string'

defineOptions({
  name: 'MenuTreeItem',
})

const { item } = defineProps<{
  item: Menu
}>()

const { t } = useI18n()

const router = useRouter()

function handleClick(item: Menu) {
  if (item.path) {
    if (isHttpUrl(item.path)) {
      window.open(item.path, '_blank')
    }
    else {
      router.push(item.path)
    }
  }
}
</script>

<template>
  <template v-if="item.children">
    <a-sub-menu :key="item.id">
      <template #icon>
        <Icon class="!text-xl" :icon="item.icon" />
      </template>
      <template #title>
        <span class="text-sm">{{ item.i18nKey ? t(item.i18nKey) : item.title }}</span>
      </template>
      <MenuTreeItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
      />
    </a-sub-menu>
  </template>
  <template v-else>
    <a-menu-item :key="item.id" @click="handleClick(item)">
      <template v-if="item.icon" #icon>
        <Icon class="!text-xl" :icon="item.icon" />
      </template>
      <template v-if="!item.parentId" #title>
        {{ item.i18nKey ? t(item.i18nKey) : item.title }}
      </template>
      <span class="text-sm">{{ item.i18nKey ? t(item.i18nKey) : item.title }}</span>
    </a-menu-item>
  </template>
</template>
