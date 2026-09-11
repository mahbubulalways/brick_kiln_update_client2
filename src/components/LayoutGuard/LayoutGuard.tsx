"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { getToken } from "@/service/auth.services";

export enum UserRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    SYSTEM_ADMIN = "SYSTEM_ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN",
}

type TTokenPayload = {
    role: UserRole;
    exp?: number;
};

const USER_ROLES: UserRole[] = [
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.MANAGER,
];

const SYSTEM_ROLES: UserRole[] = [
    UserRole.SYSTEM_ADMIN,
    UserRole.SUPER_ADMIN,
];

export default function LayoutGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        setIsChecking(true);
        setIsAuthorized(false);

        /*
        |--------------------------------------------------------------------------
        | Public Routes
        |--------------------------------------------------------------------------
        */

        if (pathname === "/login") {
            setIsAuthorized(true);
            setIsChecking(false);
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Get Token
        |--------------------------------------------------------------------------
        */

        const token = getToken();

        if (!token) {
            router.replace("/login");
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Decode Token
        |--------------------------------------------------------------------------
        */

        try {
            const decoded = jwtDecode<TTokenPayload>(token);

            const role = decoded.role;

            /*
            |--------------------------------------------------------------------------
            | Validate Role
            |--------------------------------------------------------------------------
            */

            if (!role) {
                router.replace("/login");
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Token Expiration
            |--------------------------------------------------------------------------
            */

            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                router.replace("/login");
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Route Types
            |--------------------------------------------------------------------------
            */

            const isUserRoute =
                pathname === "/" ||
                pathname.startsWith("/dashboard");

            const isSystemRoute =
                pathname === "/system" ||
                pathname.startsWith("/system/");

            /*
            |--------------------------------------------------------------------------
            | Role Types
            |--------------------------------------------------------------------------
            */

            const isUserRole = USER_ROLES.includes(role);
            const isSystemRole = SYSTEM_ROLES.includes(role);

            /*
            |--------------------------------------------------------------------------
            | Invalid Role
            |--------------------------------------------------------------------------
            */

            if (!isUserRole && !isSystemRole) {
                router.replace("/login");
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | System User -> User Route
            |--------------------------------------------------------------------------
            */

            if (isUserRoute && !isUserRole) {
                router.replace("/system");
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Normal User -> System Route
            |--------------------------------------------------------------------------
            */

            if (isSystemRoute && !isSystemRole) {
                router.replace("/dashboard");
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Authorized
            |--------------------------------------------------------------------------
            */

            setIsAuthorized(true);
            setIsChecking(false);
        } catch (error) {
            console.error("Invalid token:", error);

            router.replace("/login");
        }
    }, [pathname, router]);

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                {/* <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" /> */}
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Unauthorized
    |--------------------------------------------------------------------------
    */

    if (!isAuthorized) {
        return null;
    }


    return <>{children}</>;
}