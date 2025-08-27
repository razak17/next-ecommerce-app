export const redirects = {
  toLogin: "/login",
  toSignup: "/register",
  afterLogin: "/dashboard",
  afterLogout: "/",
  afterVerify: "/dashboard",
  toResetPassword: "/reset-password",
  toForgotPassword: "/forgot-password",
  toLanding: "/",
  toDashboard: "/dashboard",
  adminToDashboard: "/admin/dashboard",
} as const;
