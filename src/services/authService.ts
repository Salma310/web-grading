import { api } from './api'

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
export type UserRole = 'ADMIN' | 'QC' | 'MANAGER'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string | null
  is_active: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthSession extends AuthTokens {
  user: AuthUser
}

export interface LoginPayload {
  email: string
  password: string
  client?: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role?: UserRole
  phone?: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface UpdateProfilePayload {
  name: string
  email: string
  phone?: string | null
}

// ─────────────────────────────────────────
// Keys untuk localStorage
// ─────────────────────────────────────────
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'auth_user'

// ─────────────────────────────────────────
// Token helpers
// ─────────────────────────────────────────
export const getAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY)

export const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY)

export const getStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? (JSON.parse(raw) as AuthUser) : null
}

export const saveSession = ({ accessToken, refreshToken, user }: Partial<AuthSession>): void => {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const clearSession = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const isAuthenticated = (): boolean => !!getAccessToken()

// ─────────────────────────────────────────
// API calls
// ─────────────────────────────────────────

export const login = async (credentials: LoginPayload): Promise<AuthSession> => {
  const res = await api.post<{ success: boolean; data: AuthSession }>('/auth/login', { ...credentials, client: 'web' })
  const { user, accessToken, refreshToken } = res.data.data
  saveSession({ accessToken, refreshToken, user })
  return res.data.data
}

export const register = async (payload: RegisterPayload): Promise<AuthSession> => {
  const res = await api.post<{ success: boolean; data: AuthSession }>('/auth/register', payload)
  const { user, accessToken, refreshToken } = res.data.data
  saveSession({ accessToken, refreshToken, user })
  return res.data.data
}

// Registrasi user baru oleh admin — tidak menyimpan session token admin yang aktif
export const registerUser = async (payload: RegisterPayload): Promise<AuthSession['user']> => {
  const res = await api.post<{ success: boolean; data: AuthSession }>('/auth/register', payload)
  return res.data.data.user
}

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout')
  } catch {
    // tetap clear meski request gagal
  } finally {
    clearSession()
  }
}

export const fetchMe = async (): Promise<AuthUser> => {
  const res = await api.get<{ success: boolean; data: AuthUser }>('/auth/me')
  return res.data.data
}

export const updateProfile = async (
  id: string,
  payload: UpdateProfilePayload,
): Promise<AuthUser> => {
  const res = await api.put<
    {
      success?: boolean
      data?: AuthUser
      user?: AuthUser
    } & Partial<AuthUser>
  >(`/user/${id}`, payload)
  const updatedUser = res.data.data ?? res.data.user ?? (res.data as AuthUser)

  saveSession({ user: updatedUser })
  return updatedUser
}

export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token available.')

  const res = await api.post<{ success: boolean; data: AuthTokens }>('/auth/refresh', {
    refreshToken,
  })
  const { accessToken, refreshToken: newRefresh } = res.data.data
  saveSession({ accessToken, refreshToken: newRefresh })
  return accessToken
}

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<{ success: boolean; message: string }> => {
  const res = await api.put<{ success: boolean; message: string }>('/auth/change-password', payload)
  return res.data
}
