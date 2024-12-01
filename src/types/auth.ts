export interface SignInType {
  email: string;
  password: string;
}

export interface ForgotPasswordType {
  email: string;
}

export interface ResetPasswordType {
  password: string;
  token?: string;
}
