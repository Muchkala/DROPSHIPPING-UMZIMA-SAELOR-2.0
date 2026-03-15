// Configuration file for auth settings
// Set to true to bypass authentication, false to enable normal auth flow
export const AUTH_CONFIG = {
  BYPASS_ENABLED: true,
  SHOW_BYPASS_NOTICE: true,
  QUICK_LOGIN_ENABLED: true,
  MOCK_USER: {
    id: "bypass-user",
    email: "demo@example.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

// Helper function to check if auth is bypassed
export const isAuthBypassed = () => AUTH_CONFIG.BYPASS_ENABLED

// Helper function to get mock user
export const getMockUser = () => AUTH_CONFIG.MOCK_USER
