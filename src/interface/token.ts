export interface IToken {
  email: string;
  userId: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "OWNER" | "SYSTEM_ADMIN"
}

export type JwtTokenPayload = {
  exp: number;
  iat: number;
  jti: string;
  email: string;
  userId: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "OWNER" | "SYSTEM_ADMIN"
  vataId: string
};
