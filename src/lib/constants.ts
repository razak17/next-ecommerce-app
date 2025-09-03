export const unknownError =
  "An unknown error occurred. Please try again later.";

export const redirects = {
  toLogin: "/auth/login",
  toRegister: "/auth/register",
  afterLogin: "/dashboard",
  afterLogout: "/",
  afterVerify: "/dashboard",
  toResetPassword: "/reset-password",
  toForgotPassword: "/forgot-password",
  toLanding: "/",
  toProfile: "/profile",
  toTerms: "/terms",
  toPrivacy: "/privacy",
  toDashboard: "/dashboard",
  adminToDashboard: "/admin/dashboard",
  adminToCategories: "/admin/categories",
  adminToProducts: "/admin/products",
  adminToUsers: "/admin/users",
} as const;
