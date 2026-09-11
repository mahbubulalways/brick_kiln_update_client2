"use server";

import { AUTH_KEY } from "@/constant";
import { cookies } from "next/headers";

export const deleteCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_KEY);
};
