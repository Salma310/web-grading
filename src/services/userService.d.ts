export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'QC' | 'MANAGER'
  phone?: string | null
  is_active: boolean
}

export interface UserUpdatePayload {
  name?: string
  email?: string
  phone?: string | null
  role?: 'ADMIN' | 'QC' | 'MANAGER'
  is_active?: boolean
}

export interface ApiResponse<T> {
  data: T | { data: T }
}

export function getUsers(): Promise<ApiResponse<User[]>>

export function getUserById(id: string): Promise<ApiResponse<User>>

export function createUser(data: Partial<User>): Promise<ApiResponse<User>>

export function updateUser(id: string, data: UserUpdatePayload): Promise<ApiResponse<User>>

export function deleteUser(id: string): Promise<ApiResponse<any>>
