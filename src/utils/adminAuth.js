export const setAdminAuth = (accessToken, refreshToken = null) => {
  localStorage.setItem("adminToken", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const getAdminAuth = () => {
  return localStorage.getItem("adminToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("refreshToken");
};
