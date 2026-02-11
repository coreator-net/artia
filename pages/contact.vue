<script setup lang="ts">
/**
 * 聯絡我們頁面
 * 提供訪客聯繫網站管理者的表單
 */
const { t: themeT } = useTheme()
const { t } = useI18n()

// 表單資料
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

// 表單狀態
const isSubmitting = ref(false)
const submitStatus = ref<'idle' | 'success' | 'error'>('idle')
const errorMessage = ref('')

// 表單驗證錯誤
const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

// 驗證 email 格式
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 驗證表單
const validateForm = (): boolean => {
  let isValid = true
  
  // 清除舊的錯誤
  errors.name = ''
  errors.email = ''
  errors.subject = ''
  errors.message = ''
  
  if (!form.name.trim()) {
    errors.name = t('contact.validation.nameRequired')
    isValid = false
  }
  
  if (!form.email.trim()) {
    errors.email = t('contact.validation.emailRequired')
    isValid = false
  } else if (!isValidEmail(form.email)) {
    errors.email = t('contact.validation.emailInvalid')
    isValid = false
  }
  
  if (!form.subject.trim()) {
    errors.subject = t('contact.validation.subjectRequired')
    isValid = false
  }
  
  if (!form.message.trim()) {
    errors.message = t('contact.validation.messageRequired')
    isValid = false
  }
  
  return isValid
}

// 提交表單
const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  submitStatus.value = 'idle'
  errorMessage.value = ''
  
  try {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      },
    })
    
    if (response.success) {
      submitStatus.value = 'success'
      // 清空表單
      form.name = ''
      form.email = ''
      form.subject = ''
      form.message = ''
    } else {
      submitStatus.value = 'error'
      errorMessage.value = (response as { error?: string }).error || t('contact.error')
    }
  } catch (error) {
    submitStatus.value = 'error'
    errorMessage.value = t('contact.error')
  } finally {
    isSubmitting.value = false
  }
}

// SEO
useSeoMeta({
  title: () => t('contact.title'),
  description: () => t('contact.subtitle'),
})
</script>

<template>
  <div :class="themeT('contact-page')">
    <div :class="themeT('contact-container')">
      <!-- 標題區 -->
      <div :class="themeT('contact-header')">
        <h1 :class="themeT('contact-title')">{{ t('contact.title') }}</h1>
        <p :class="themeT('contact-subtitle')">{{ t('contact.subtitle') }}</p>
      </div>
      
      <!-- 成功訊息 -->
      <div v-if="submitStatus === 'success'" :class="themeT('contact-success')">
        <svg :class="themeT('contact-success-icon')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <p>{{ t('contact.success') }}</p>
      </div>
      
      <!-- 表單 -->
      <form v-else :class="themeT('contact-form')" @submit.prevent="handleSubmit">
        <!-- 錯誤訊息 -->
        <div v-if="submitStatus === 'error'" :class="themeT('contact-error')">
          {{ errorMessage }}
        </div>
        
        <!-- 姓名 -->
        <div :class="themeT('contact-field')">
          <label :for="'name'" :class="themeT('label')">{{ t('contact.name') }}</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            :class="[themeT('input'), errors.name ? themeT('input-error') : '']"
            :placeholder="t('contact.namePlaceholder')"
            :disabled="isSubmitting"
          />
          <span v-if="errors.name" :class="themeT('contact-field-error')">{{ errors.name }}</span>
        </div>
        
        <!-- Email -->
        <div :class="themeT('contact-field')">
          <label :for="'email'" :class="themeT('label')">{{ t('contact.email') }}</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            :class="[themeT('input'), errors.email ? themeT('input-error') : '']"
            :placeholder="t('contact.emailPlaceholder')"
            :disabled="isSubmitting"
          />
          <span v-if="errors.email" :class="themeT('contact-field-error')">{{ errors.email }}</span>
        </div>
        
        <!-- 主旨 -->
        <div :class="themeT('contact-field')">
          <label :for="'subject'" :class="themeT('label')">{{ t('contact.subject') }}</label>
          <input
            id="subject"
            v-model="form.subject"
            type="text"
            :class="[themeT('input'), errors.subject ? themeT('input-error') : '']"
            :placeholder="t('contact.subjectPlaceholder')"
            :disabled="isSubmitting"
          />
          <span v-if="errors.subject" :class="themeT('contact-field-error')">{{ errors.subject }}</span>
        </div>
        
        <!-- 訊息 -->
        <div :class="themeT('contact-field')">
          <label :for="'message'" :class="themeT('label')">{{ t('contact.message') }}</label>
          <textarea
            id="message"
            v-model="form.message"
            :class="[themeT('input'), themeT('contact-textarea'), errors.message ? themeT('input-error') : '']"
            :placeholder="t('contact.messagePlaceholder')"
            :disabled="isSubmitting"
            rows="6"
          />
          <span v-if="errors.message" :class="themeT('contact-field-error')">{{ errors.message }}</span>
        </div>
        
        <!-- 提交按鈕 -->
        <button
          type="submit"
          :class="themeT('btn-primary')"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? t('contact.sending') : t('contact.submit') }}
        </button>
      </form>
    </div>
  </div>
</template>
