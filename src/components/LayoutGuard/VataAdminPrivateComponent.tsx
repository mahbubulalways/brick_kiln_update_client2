"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserInformation } from "@/service/auth.services";

interface VataAdminPrivateComponentProps {
    children: ReactNode;
    roles: string[];
}

const VataAdminPrivateComponent = ({
    children,
    roles,
}: VataAdminPrivateComponentProps) => {
    const router = useRouter();
    const role = getUserInformation().role;

    useEffect(() => {
        if (!role) {
            router.replace("/login");
            return;
        }

        if (!roles.includes(role)) {
            router.replace("/dashboard");
        }
    }, [role, roles, router]);

    if (!role || !roles.includes(role)) {
        return null;
    }

    return <>{children}</>;
};

export default VataAdminPrivateComponent;