// userLogin.ts
"use server";

import { FieldValues } from "react-hook-form";
import setAccessToken from "./setTokenCookie";

export const userLogin = async (data: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      },
    );
    const result = await res.json();
    if (result?.success) {
      await setAccessToken(result?.data?.token);
      const redirectPath = getRoleBaseRedirect();
      return { ...result, redirectPath };
    }
    return result;
  } catch {
    // console.log(error);
  }
};

const getRoleBaseRedirect = () => {
  return "/";
};
