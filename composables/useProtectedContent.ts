/**
 * Composable for handling password-protected content
 */
export const useProtectedContent = () => {
  const verifyPassword = async (path: string, password: string) => {
    try {
      const response = await $fetch(`/api/content${path}`, {
        query: { password }
      })
      return { success: true, content: response }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.data?.message || 'Invalid password' 
      }
    }
  }
  
  return {
    verifyPassword
  }
}
