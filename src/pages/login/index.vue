<script setup lang="ts">
import type { CheckboxProps } from 'ant-design-vue'

import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { LoginInfo } from '@/types/user'

import { LangSelect, ThemeToggle } from '@/components/common'
import { Icon } from '@/components/icon'
import { Wave } from '@/components/login'
import { useLoading } from '@/hooks/useLoading'
import { useUserStore } from '@/stores/userStore'
import { deCode, enCode } from '@/utils/string'

const { t } = useI18n()
const { login } = useUserStore()
const { loading, loadingFnWrapper } = useLoading()

const title = computed(() => import.meta.env.VITE_APP_TITLE)

const form = reactive<LoginInfo>({
  username: 'pure-admin',
  password: '123456',
})
const rules = computed(() => ({
  username: [{ required: true, message: t('page.login.userNamePlaceholder') }],
  password: [
    { required: true, message: t('page.login.passwordPlaceholder') },
  ],
}))

const isRemember = ref(false)
const rememberKey = enCode('LOGIN_REMEMBER')
const rememberValueTrue = enCode('LOGIN_REMEMBER_TRUE')
const rememberUsernameKey = enCode('LOGIN_REMEMBER_USERNAME')
const rememberPasswordKey = enCode('LOGIN_REMEMBER_PASSWORD')

if (localStorage.getItem(rememberKey) === rememberValueTrue) {
  setRemember()
}

const onRememberChange: CheckboxProps['onChange'] = (e) => {
  if (!e.target.checked) {
    clearRemember()
  }
}

function onForgot() {
  // 跳转到忘记密码页面
}

const handleLogin = loadingFnWrapper(async (data: LoginInfo) => {
  await login(data)
  if (isRemember.value) {
    saveRemember(data.username, data.password)
  }
})

async function onFinish(data: LoginInfo) {
  handleLogin(data)
}

function setRemember() {
  const remember = localStorage.getItem(rememberKey)
  if (remember === rememberValueTrue) {
    form.username = deCode(localStorage.getItem(rememberUsernameKey) || '')
    form.password = deCode(localStorage.getItem(rememberPasswordKey) || '')
    isRemember.value = true
  }
}

function saveRemember(username: string, password: string) {
  localStorage.setItem(rememberKey, rememberValueTrue)
  localStorage.setItem(rememberUsernameKey, enCode(username))
  localStorage.setItem(rememberPasswordKey, enCode(password))
}

function clearRemember() {
  localStorage.removeItem(rememberKey)
  localStorage.removeItem(rememberUsernameKey)
  localStorage.removeItem(rememberPasswordKey)
}
</script>

<template>
  <div class="relative bg-login dark:bg-login-dark">
    <div class="min-h-[80vh] w-screen flex flex-col items-center justify-center py-10">
      <div class="space-y-4">
        <div class="flex items-center justify-center gap-4 text-center text-white/88 dark:text-black/85">
          <Icon icon="icon-local:logo" class="block text-5xl" />
          <div class="text-3xl font-bold">
            {{ title }}
          </div>
        </div>
        <div class="w-80 border rounded-xl bg-white/80 p-4 shadow transition-all dark:bg-black/80 hover:shadow-2xl">
          <a-form
            :model="form"
            :rules="rules"
            validate-on-rule-change
            @finish="onFinish"
          >
            <a-form-item name="username">
              <a-input
                v-model:value="form.username"
                :disabled="loading"
                size="large"
                allow-clear
                :placeholder="t('page.login.userNamePlaceholder')"
              >
                <template #prefix>
                  <UserOutlined style="color: #D9D9D9;" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="password">
              <a-input-password
                v-model:value="form.password"
                :disabled="loading"
                size="large"
                allow-clear
                :placeholder="t('page.login.passwordPlaceholder')"
              >
                <template #prefix>
                  <LockOutlined style="color: #D9D9D9;" />
                </template>
              </a-input-password>
            </a-form-item>
            <div class="mb-4 flex flex-row justify-between">
              <a-checkbox
                v-model:checked="isRemember"
                :disabled="loading"
                size="large"
                class="cursor-pointer select-none"
                @change="onRememberChange"
              >
                {{ t('page.login.rememberMe') }}
              </a-checkbox>
              <a-typography-link
                class="cursor-pointer select-none"
                @click="onForgot"
              >
                {{ t('page.login.forgotPassword') }}
              </a-typography-link>
            </div>
            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                :loading="loading"
                size="large"
                block
              >
                {{ t('page.login.login') }}
              </a-button>
            </a-form-item>
          </a-form>
          <div class="flex justify-end">
            <LangSelect />
            <ThemeToggle :animate="false" />
          </div>
        </div>
      </div>
    </div>
    <Wave />
  </div>
</template>
