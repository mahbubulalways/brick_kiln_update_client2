"use client";
import { TApprovalStatus } from "@/interface/approval";
import { getUserInformation } from "@/service/auth.services";

export default function approvalButtonDisable(status: TApprovalStatus) {
  const userRole = getUserInformation().role;
  if (userRole === "ADMIN" || userRole === "OWNER") {
    return false;
  }
  if (status === "PENDING") {
    return true;
  }
}
