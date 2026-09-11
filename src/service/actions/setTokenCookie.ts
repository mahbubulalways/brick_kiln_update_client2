"use server";

import { AUTH_KEY } from "@/constant";
import { cookies } from "next/headers";
const setAccessToken = async (token: string) => {
  (await cookies()).set(AUTH_KEY, token);
};

export default setAccessToken;
