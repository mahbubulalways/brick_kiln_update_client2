import VataAdminPrivateComponent from "@/components/LayoutGuard/VataAdminPrivateComponent";
import ApprovalRequestPage from "@/components/Pages/ApprovalRequestPage/ApprovalRequestPage";
import { TQuerySearch } from "@/interface/query";
import { modifyQuery } from "@/utils/modifyQuery";

export default async function page({ searchParams }: TQuerySearch) {
    const query = await searchParams
    const { currentLimit, currentPage } = modifyQuery(query)
    return (
        <VataAdminPrivateComponent roles={["ADMIN", "OWNER"]}>
            <ApprovalRequestPage
                limit={currentLimit}
                page={currentPage}
            />
        </VataAdminPrivateComponent>
    )
}
