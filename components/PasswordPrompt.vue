<template>
  <div class="password-prompt">
    <div class="password-box">
      <h2>🔒 此內容受密碼保護</h2>
      <p class="hint">請輸入密碼以查看完整內容</p>
      
      <form @submit.prevent="handleSubmit">
        <input
          v-model="password"
          type="password"
          placeholder="請輸入密碼"
          :disabled="loading"
          class="password-input"
        />
        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? '驗證中...' : '解鎖' }}
        </button>
      </form>
      
      <p v-if="error" class="error">{{ error }}</p>
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

<style scoped>
.password-prompt {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 2rem;
}

.password-box {
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  text-align: center;
}

.hint {
  text-align: center;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.password-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
}

.password-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.submit-btn {
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
}
</style>
