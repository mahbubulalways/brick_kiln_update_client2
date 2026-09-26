"use client"
import { IApprovalRequest } from "@/interface/approval";
import { TMetaConfig } from "@/interface/meta";
import { TQuery } from "@/interface/query";
import { useGetAllApprovalRequestQuery } from "@/redux/features/approval";

export default function ApprovalRequestPage({ page, limit }: TQuery) {
    const { isLoading, data, isError } = useGetAllApprovalRequestQuery({ page, limit })
    const approvals = data?.data?.data as IApprovalRequest[]
    const meta = data?.data?.meta as TMetaConfig;
    return (
        <div>
            {approvals?.length}
        </div>
    )
}
