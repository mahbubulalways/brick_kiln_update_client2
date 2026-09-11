import { removeFromLocalStorage } from "@/utils/localStorage";
import { AUTH_KEY } from "@/constant";
import { deleteCookie } from "./deleteCookie";

export const logOutUserFromSystem = () => {
  deleteCookie();
  removeFromLocalStorage(AUTH_KEY);
};
