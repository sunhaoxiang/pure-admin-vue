import messages from '@intlify/unplugin-vue-i18n/messages'
import { createI18n } from 'vue-i18n'

import { DEFAULT_LOCALE, FALLBACK_LOCALE } from '@/constants/app'
import { projectSign } from '@/utils/string'

const locale = localStorage.getItem(projectSign('locale')) || DEFAULT_LOCALE

export const i18n = createI18n({
  locale,
  fallbackLocale: FALLBACK_LOCALE,
  messages,
  legacy: false,
})
