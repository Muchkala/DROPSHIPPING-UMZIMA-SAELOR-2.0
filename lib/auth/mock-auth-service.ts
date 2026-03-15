import bcrypt from "bcryptjs"
import type { AuthService } from "./auth-service"
import type { AuthUser, StoredSession, StoredUser, StoredVerificationCode } from "./types"

const USERS_KEY = "mock_auth_users_v1"
const SESSION_KEY = "mock_auth_session_v1"
const CODE_KEY = "mock_auth_verification_codes_v1"
const RESET_EMAIL_KEY = "mock_auth_password_reset_email_v1"

type Persistence = "local" | "session"

type StoredCodesByEmail = Record<string, StoredVerificationCode>

type StoredUsersByEmail = Record<string, StoredUser>

function nowIso() {
  return new Date().toISOString()
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isBrowser() {
  return typeof window !== "undefined"
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function ensureBrowser() {
  if (!isBrowser()) {
    throw new Error("Auth is only available in the browser")
  }
}

export class MockAuthService implements AuthService {
  private persistence: Persistence = "local"
  private minDelayMs = 450
  private maxDelayMs = 900

  setRememberMe(remember: boolean) {
    this.persistence = remember ? "local" : "session"
  }

  private async delay() {
    const ms = Math.floor(this.minDelayMs + Math.random() * (this.maxDelayMs - this.minDelayMs))
    await sleep(ms)
  }

  private getStorage(persistence: Persistence) {
    ensureBrowser()
    return persistence === "local" ? window.localStorage : window.sessionStorage
  }

  private readUsers(): StoredUsersByEmail {
    ensureBrowser()
    return safeJsonParse<StoredUsersByEmail>(window.localStorage.getItem(USERS_KEY), {})
  }

  private writeUsers(users: StoredUsersByEmail) {
    ensureBrowser()
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  private readCodes(): StoredCodesByEmail {
    ensureBrowser()
    return safeJsonParse<StoredCodesByEmail>(window.localStorage.getItem(CODE_KEY), {})
  }

  private writeCodes(codes: StoredCodesByEmail) {
    ensureBrowser()
    window.localStorage.setItem(CODE_KEY, JSON.stringify(codes))
  }

  private clearSession() {
    ensureBrowser()
    window.localStorage.removeItem(SESSION_KEY)
    window.sessionStorage.removeItem(SESSION_KEY)
  }

  private writeSession(userId: string) {
    const storage = this.getStorage(this.persistence)
    const session: StoredSession = { userId, issuedAt: Date.now() }
    storage.setItem(SESSION_KEY, JSON.stringify(session))

    const otherStorage = this.getStorage(this.persistence === "local" ? "session" : "local")
    otherStorage.removeItem(SESSION_KEY)
  }

  private readSession(): StoredSession | null {
    ensureBrowser()
    const local = safeJsonParse<StoredSession | null>(window.localStorage.getItem(SESSION_KEY), null)
    if (local?.userId) return local
    const session = safeJsonParse<StoredSession | null>(window.sessionStorage.getItem(SESSION_KEY), null)
    if (session?.userId) return session
    return null
  }

  private toAuthUser(user: StoredUser): AuthUser {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  async register(email: string, password: string): Promise<AuthUser> {
    await this.delay()
    ensureBrowser()

    const normalized = normalizeEmail(email)
    if (!isValidEmail(normalized)) throw new Error("Please enter a valid email address")
    if (password.length < 8) throw new Error("Password must be at least 8 characters")

    const users = this.readUsers()
    if (users[normalized]) throw new Error("An account with this email already exists")

    const id = crypto?.randomUUID ? crypto.randomUUID() : String(Date.now())
    const passwordHash = await bcrypt.hash(password, 10)

    const user: StoredUser = {
      id,
      email: normalized,
      passwordHash,
      createdAt: nowIso(),
      updatedAt: nowIso()
    }

    users[normalized] = user
    this.writeUsers(users)
    this.writeSession(id)

    return this.toAuthUser(user)
  }

  async login(email: string, password: string): Promise<AuthUser> {
    await this.delay()
    ensureBrowser()

    const normalized = normalizeEmail(email)
    const users = this.readUsers()
    const user = users[normalized]
    if (!user) throw new Error("Invalid email or password")

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) throw new Error("Invalid email or password")

    this.writeSession(user.id)
    return this.toAuthUser(user)
  }

  async logout(): Promise<void> {
    await this.delay()
    ensureBrowser()
    this.clearSession()
    window.sessionStorage.removeItem(RESET_EMAIL_KEY)
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    await this.delay()
    ensureBrowser()

    const session = this.readSession()
    if (!session) return null

    const users = this.readUsers()
    const user = Object.values(users).find((u) => u.id === session.userId)
    return user ? this.toAuthUser(user) : null
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await this.delay()
    ensureBrowser()

    if (newPassword.length < 8) throw new Error("New password must be at least 8 characters")

    const users = this.readUsers()

    const current = await this.getCurrentUser()
    if (current) {
      const stored = users[current.email]
      if (!stored) throw new Error("User not found")

      const ok = await bcrypt.compare(oldPassword, stored.passwordHash)
      if (!ok) throw new Error("Old password is incorrect")

      stored.passwordHash = await bcrypt.hash(newPassword, 10)
      stored.updatedAt = nowIso()
      users[stored.email] = stored
      this.writeUsers(users)
      return
    }

    const resetEmail = window.sessionStorage.getItem(RESET_EMAIL_KEY)
    if (!resetEmail) throw new Error("Please verify your code before changing your password")

    const normalized = normalizeEmail(resetEmail)
    const stored = users[normalized]
    if (!stored) throw new Error("Account not found")

    stored.passwordHash = await bcrypt.hash(newPassword, 10)
    stored.updatedAt = nowIso()
    users[normalized] = stored
    this.writeUsers(users)

    window.sessionStorage.removeItem(RESET_EMAIL_KEY)
  }

  async sendCode(email: string): Promise<{ code: string }> {
    await this.delay()
    ensureBrowser()

    const normalized = normalizeEmail(email)
    if (!isValidEmail(normalized)) throw new Error("Please enter a valid email address")

    const users = this.readUsers()
    if (!users[normalized]) throw new Error("No account found with this email")

    const code = String(Math.floor(100000 + Math.random() * 900000))
    const codes = this.readCodes()

    codes[normalized] = {
      email: normalized,
      code,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000
    }

    this.writeCodes(codes)
    return { code }
  }

  async verifyCode(email: string, code: string): Promise<void> {
    await this.delay()
    ensureBrowser()

    const normalized = normalizeEmail(email)
    const codes = this.readCodes()
    const record = codes[normalized]

    if (!record) throw new Error("No verification code found. Please request a new one.")
    if (Date.now() > record.expiresAt) throw new Error("Verification code expired. Please request a new one.")
    if (record.code !== code.trim()) throw new Error("Invalid verification code")

    window.sessionStorage.setItem(RESET_EMAIL_KEY, normalized)

    delete codes[normalized]
    this.writeCodes(codes)
  }
}
