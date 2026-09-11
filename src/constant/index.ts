export const AUTH_KEY = "token";

export const SERVER_ERROR_MESSAGE =
  "সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।";
export const NO_DATA_FOUND_MESSAGE = "কোনো তথ্য পাওয়া যায়নি।";


export enum UserRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    SYSTEM_ADMIN = "SYSTEM_ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN",
}
