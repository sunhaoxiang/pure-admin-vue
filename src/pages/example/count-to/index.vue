<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { BaseContainer } from '@/components/container'
import { CountTo } from '@/components/count-to'

const { t } = useI18n()
</script>

<template>
  <BaseContainer :title="t('page.countToExample.title')">
    <h2>{{ t('page.countToExample.basicUsage') }}</h2>
    <CountTo :start-value="0" :end-value="1000" :duration="3000" />

    <h2 class="mt-4">
      {{ t('page.countToExample.prefixSuffix') }}
    </h2>
    <CountTo :start-value="0" :end-value="2000" :duration="3000" prefix="¥" suffix="元" />

    <h2 class="mt-4">
      {{ t('page.countToExample.decimals') }}
    </h2>
    <CountTo :start-value="0" :end-value="2000" :duration="3000" prefix="¥" suffix="元" :decimals="2" />
  </BaseContainer>
</template>
