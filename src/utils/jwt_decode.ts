import { jwtDecode } from "jwt-decode";

export const decodedToken = (token: string) => {
  try {
    return jwtDecode(token);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};
