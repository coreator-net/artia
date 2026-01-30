<script setup lang="ts">
const emit = defineEmits<{
  authenticated: [content: any]
}>()

const { t } = useTheme()
const password = ref('')
const loading = ref(false)
const error = ref('')

const route = useRoute()
const { verifyPassword } = useProtectedContent()

const handleSubmit = async () => {
  if (!password.value) {
    error.value = '請輸入密碼'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const result = await verifyPassword(route.path, password.value)
    
    if (result.success) {
      emit('authenticated', result.content)
    } else {
      error.value = result.error
    }
  } catch (e) {
    error.value = '驗證失敗，請重試'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div :class="t('password-prompt')">
    <div :class="t('password-box')">
      <h2 :class="t('password-title')">🔒 此內容受密碼保護</h2>
      <p :class="t('password-hint')">請輸入密碼以查看完整內容</p>
      
      <form @submit.prevent="handleSubmit" :class="t('password-form')">
        <input
          v-model="password"
          type="password"
          placeholder="請輸入密碼"
          :disabled="loading"
          :class="t('input')"
        />
        <button type="submit" :disabled="loading" :class="t('password-submit')">
          {{ loading ? '驗證中...' : '解鎖' }}
        </button>
      </form>
      
      <p v-if="error" :class="t('password-error')">{{ error }}</p>
    </div>
  </div>
</template>
