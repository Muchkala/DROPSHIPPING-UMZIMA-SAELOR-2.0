export type AuthUser = {
  id: string
  email: string
  createdAt: string
  updatedAt: string
}

export type StoredUser = {
  id: string
  email: string
  passwordHash: string
  createdAt: string
  updatedAt: string
}

export type StoredSession = {
  userId: string
  issuedAt: number
}

export type StoredVerificationCode = {
  email: string
  code: string
  createdAt: number
  expiresAt: number
}
