import { AUTH_KEY } from "@/constant";
import { JwtTokenPayload } from "@/interface/token";

import { decodedToken } from "@/utils/jwt_decode";

import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "@/utils/localStorage";

// * STORE TOKEN INTO LOCAL STORAGE
export const storeUserInLocalStorage = (token: string) => {
  return setToLocalStorage(AUTH_KEY, token);
};

// * GET TOKEN FROM LOCAL STORAGE

export const getToken = () => {
  const token = getFromLocalStorage(AUTH_KEY);

  return token;
};

// * GET USER INFO FROM LOCAL STORAGE

export const getUserInformation = () => {
  const token = getFromLocalStorage(AUTH_KEY);
  const decode = decodedToken(token as string) as JwtTokenPayload;
  return decode;
};

// * LOG OUT USER FROM THE SYSTEM
export const logoutUserFromSystem = () => {
  return removeFromLocalStorage(AUTH_KEY);
};
