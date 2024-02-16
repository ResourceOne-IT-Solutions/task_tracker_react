export interface PasswordInterface {
  password: string;
  repassword: string;
}
export interface MailVerifyInterface {
  data: string;
}
export interface OtpApidataInterface {
  data: {
    key: string | undefined;
    otp: string;
  };
}
export interface OtpApiResponse {
  message: string;
}
export interface UpdatePasswordInterface {
  credentials: { userId?: string; email?: string };
  data: { password: string };
}
export interface ErrorMessageInterface {
  message: string;
}

