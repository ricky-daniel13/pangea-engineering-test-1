import { ConfigValue } from "../Config";
import Cookies from "js-cookie";

export const AUTH_TOKEN_KEY = ConfigValue.AUTH_TOKEN_KEY;
export const AUTH_USER_INFO = ConfigValue.AUTH_USER_INFO;

export const getAuthToken = () => {
  if (typeof window === undefined) {
    return null;
  }
  return Cookies.get(AUTH_TOKEN_KEY);
};

export function setAuthToken(token) {
  Cookies.set(AUTH_TOKEN_KEY, token, { expires: 1 });
}

export function removeAuthToken() {
  Cookies.remove(AUTH_TOKEN_KEY);
}

export function checkHasAuthToken() {
  const token = Cookies.get(AUTH_TOKEN_KEY);
  if (!token) return false;
  return true;
}

export const getAuthUserInfo = () => {
  if (typeof window === undefined) {
    return null;
  }

  const userInfo = Cookies.get(AUTH_USER_INFO);
  if (userInfo) {
    return JSON.parse(userInfo);
  } else {
    return null;
  }
};

export function setAuthUserInfo(info) {
  Cookies.set(AUTH_USER_INFO, JSON.stringify(info), { expires: 1 });
}
