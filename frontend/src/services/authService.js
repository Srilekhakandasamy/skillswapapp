export const getToken = () => localStorage.getItem("token");

export const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  }
};

export const clearToken = () => {
  localStorage.removeItem("token");
};

export const getUserId = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.id;
  } catch (err) {
    return null;
  }
};

export const isLoggedIn = () => Boolean(getUserId());
