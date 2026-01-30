<template>
  <div class="artia-password-prompt-theme-classic">
    <div class="artia-password-box-theme-classic">
      <h2 class="artia-password-title-theme-classic">🔒 此內容受密碼保護</h2>
      <p class="artia-password-hint-theme-classic">請輸入密碼以查看完整內容</p>
      
      <form @submit.prevent="handleSubmit" class="artia-password-form-theme-classic">
        <input
          v-model="password"
          type="password"
          placeholder="請輸入密碼"
          :disabled="loading"
          class="artia-input-theme-classic"
        />
        <button type="submit" :disabled="loading" class="artia-password-submit-theme-classic">
          {{ loading ? '驗證中...' : '解鎖' }}
        </button>
      </form>
      
      <p v-if="error" class="artia-password-error-theme-classic">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  authenticated: [content: any]
}>()

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
