import type { AuthService } from "./auth-service"
import { MockAuthService } from "./mock-auth-service"

const mock = new MockAuthService()

export const authService: AuthService = mock

export type { AuthService }
export type { AuthUser } from "./types"

export function setRememberMe(remember: boolean) {
  if ("setRememberMe" in mock) {
    ;(mock as unknown as { setRememberMe: (remember: boolean) => void }).setRememberMe(remember)
  }
}
