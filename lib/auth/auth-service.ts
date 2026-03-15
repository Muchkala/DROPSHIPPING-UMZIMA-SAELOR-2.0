import type { AuthUser } from "./types"

export interface AuthService {
  login(email: string, password: string): Promise<AuthUser>
  register(email: string, password: string): Promise<AuthUser>
  logout(): Promise<void>
  getCurrentUser(): Promise<AuthUser | null>
  changePassword(oldPassword: string, newPassword: string): Promise<void>
  sendCode?(email: string): Promise<{ code: string }>
  verifyCode?(email: string, code: string): Promise<void>
}
