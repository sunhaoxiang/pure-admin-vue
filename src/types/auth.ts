export interface LoginData {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
}
